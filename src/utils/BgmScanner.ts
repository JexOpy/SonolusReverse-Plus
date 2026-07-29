import { Logger } from "./Logger";

export class BgmScanner {
    static scan(): void {
        try {
            const bgmPlayer = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("Sonolus.Audio.BgmPlayer");
            Logger.info("=== Sonolus.Audio.BgmPlayer ===");
            bgmPlayer.methods.forEach(m => Logger.info(`Method: ${m.name} (${m.parameters.map(p => p.type.name).join(", ")})`));
            bgmPlayer.fields.forEach(f => Logger.info(`Field: ${f.name} (${f.type.name})`));

            const audioSystem = Il2Cpp.domain.assembly("Assembly-CSharp").image.class("Sonolus.Audio.AudioSystem");
            Logger.info("=== Sonolus.Audio.AudioSystem ===");
            audioSystem.methods.forEach(m => Logger.info(`Method: ${m.name} (${m.parameters.map(p => p.type.name).join(", ")})`));
            audioSystem.fields.forEach(f => Logger.info(`Field: ${f.name} (${f.type.name})`));
        } catch (e) {
            Logger.error(`BgmScanner error: ${e}`);
        }
    }
}
