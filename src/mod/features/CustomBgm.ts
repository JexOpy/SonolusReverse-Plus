import { Path } from "../../engine/native/Path";
import { Logger } from "../../utils/Logger";
import { Config } from "../data/Config";

export class CustomBgm {
    static init(): void {
        try {
            const bgmPlayerClass = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("Sonolus.Audio.BgmPlayer");

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bgmPlayerClass.method("Create", 8).implementation = function (...args: any[]) {
                const originalPath = (args[0] as Il2Cpp.String).content;

                if (Config.customBgmPath && Path.exists(Config.customBgmPath)) {
                    if (originalPath && originalPath.includes("BgmMain")) {
                        Logger.debug(`[CustomBgm] Overriding Menu BGM -> ${Config.customBgmPath}`);

                        args[0] = Il2Cpp.string(Config.customBgmPath);
                        // Reset the loop offset (args[6]) which is normally ~15.36s for the default BGM
                        args[6] = 0.0;
                    }
                }
                return this.method("Create", 8).invoke(...args);
            };

            Logger.info("[CustomBgm] Initialized");
        } catch (e) {
            Logger.error(`[CustomBgm] Error hooking BgmPlayer: ${e}`);
        }
    }
}
