import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs, { readdirSync, readFileSync } from "node:fs";
import path, { join } from "node:path";

import TerserPlugin from "terser-webpack-plugin";
import type { Configuration } from "webpack";
import webpack from "webpack";

import version from "./version.json" with { type: "json" };

interface WebpackEnv {
    dev?: boolean;
    release?: boolean;
    noBump?: boolean;
}

function hashDir(dir: string): string {
    const hash = createHash("sha256");
    const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
        const full = join(dir, entry.name);
        hash.update(entry.name);
        if (entry.isFile()) hash.update(readFileSync(full));
        else if (entry.isDirectory()) hash.update(hashDir(full));
    }

    return hash.digest("hex");
}

function getBaseVersion(): string {
    const base = `${version.major}.${version.minor}.${version.patch}`;
    // If gameBump is 0 don't add it
    return version.gameBump != 0 ? `${base}-${version.gameBump}` : base;
}

function bumpBuildNumber(noBump?: boolean): number {
    const counterPath = path.resolve(import.meta.dirname, ".build-counter");
    const current = fs.existsSync(counterPath) ? parseInt(fs.readFileSync(counterPath, "utf-8").trim(), 10) || 0 : 0;
    if (noBump) return current;

    const next = current + 1;
    fs.writeFileSync(counterPath, String(next));
    return next;
}

function getGitBranch(): string {
    try {
        return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    } catch {
        console.warn("Can't get git branch");
        return "unknown";
    }
}

export default function (env: WebpackEnv): Configuration {
    console.log(""); // indent one line after prettier
    let targetEnv = "release";
    if (env.dev) targetEnv = "dev";

    const isDev = targetEnv === "dev";
    const isRelease = targetEnv === "release";

    const srcHash = hashDir("src/").slice(0, 12);
    const buildVersion = getBaseVersion();
    const buildCounter = bumpBuildNumber(env.noBump);
    const gitBranch = getGitBranch();

    console.log(`BUILD INFO:\n- Version: ${buildVersion} (build ${buildCounter})\n- Environment: ${targetEnv}\n- Src hash: ${srcHash}\n`);

    const ifdef_options = {
        DEV: isDev,
        RELEASE: isRelease,
        version: 3,
        "ifdef-verbose": true,
        "ifdef-triple-slash": true
    };

    const plugins = [];

    plugins.push(
        new webpack.DefinePlugin({
            "process.env.BUILD_ENV": JSON.stringify(targetEnv),
            "process.env.BUILD_HASH": JSON.stringify(srcHash),
            "process.env.BUILD_VERSION": JSON.stringify(buildVersion),
            "process.env.BUILD_COUNTER": JSON.stringify(buildCounter),
            "process.env.BUILD_BRANCH": JSON.stringify(gitBranch)
        })
    );

    return {
        mode: isDev ? "development" : "production",
        entry: "./src/index.ts",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: path.resolve(import.meta.dirname, "src"),
                    use: [{ loader: "ts-loader" }, { loader: "ifdef-loader", options: ifdef_options }]
                }
            ]
        },
        resolve: {
            extensions: [".ts"]
        },
        output: {
            filename: "agent.js",
            path: path.resolve(import.meta.dirname, "dist"),
            clean: true
        },
        devtool: "eval-source-map",

        optimization: {
            minimize: isRelease,
            minimizer: isRelease
                ? [
                      new TerserPlugin({
                          terserOptions: {
                              format: {
                                  comments: false
                              },
                              compress: {
                                  dead_code: true
                              }
                          },
                          extractComments: false
                      })
                  ]
                : []
        },
        plugins: plugins,
        stats: "minimal",
        performance: {
            maxAssetSize: 5 * 1024 * 1024,
            maxEntrypointSize: 5 * 1024 * 1024
        }
    };
}
