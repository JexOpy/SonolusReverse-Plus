import { AssemblyHelper } from "../../engine/AssemblyHelper";
import { Path } from "../../engine/native/Path";
import { Logger } from "../../utils/Logger";
import { Config } from "../data/Config";

export class CustomBgm {
    private static _validatedPath: string = "";

    static init(): void {
        const BgmPlayer = AssemblyHelper.AssemblyCSharp.class("Sonolus.Audio.BgmPlayer");

        // @ts-ignore
        BgmPlayer.method<Il2Cpp.Object>("Create", 8).implementation = this.createHook;

        Logger.info("[CustomBgm::init] Initialized");
    }

    // TODO: rewrite this uhh stuff
    // TODO: remove require to restart game after changing bgm
    private static createHook(
        this: Il2Cpp.Object,
        path: Il2Cpp.String,
        startTime: number,
        bgmTime: number,
        speed: number,
        volume: number,
        loop: boolean,
        loopTime: number,
        isPrecise: boolean
    ) {
        Logger.hook("BgmPlayer::Create called");
        const originalPath = path.content;

        if (CustomBgm.shouldOverride(originalPath)) {
            Logger.debug(`[CustomBgm::createHook] Overriding UI BGM to ${Config.customBgmPath}`);
            path = Il2Cpp.string(Config.customBgmPath);

            // Reset the loop offset which is normally ~15.36s for the default BGM
            loopTime = 0.0;
        }

        return this.method("Create", 8).invoke(path, startTime, bgmTime, speed, volume, loop, loopTime, isPrecise);
    }

    private static shouldOverride(originalPath: string | null): boolean {
        return !!Config.customBgmPath && !!originalPath && originalPath.includes("BgmMain") && Path.exists(Config.customBgmPath);
    }
}
