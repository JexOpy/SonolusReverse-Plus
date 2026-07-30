import { AssemblyHelper } from "../../engine/AssemblyHelper";
import { System } from "../../engine/System";
import { ContentSystem } from "../../sonolus/wrappers/content/ContentSystem";
import { ContentTheme } from "../../sonolus/wrappers/core/content/ContentTheme";
import { Logger } from "../../utils/Logger";
import { Config } from "../data/Config";

export class UserInfoSpoof {
    private static readonly SPOOFED_VIP_DURATION_DAYS = 1337;
    private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000;

    private static readonly FALLBACK_THEMES = [
        "000001", // Retro Future
        "000002", // Under the Sakura Tree
        "000003", // Dream Live
        "000004", // Sunflowers
        "000005", // Blood Moon
        "000006", // Snowfall
        "000007", // Cozy Christmas
        "000008", // Last Stand
        "000009", // Spring Festival
        "000010", // Mission S
        "000011", // Exfiltration
        "000012", // Royalty
        "100001" // 彗く星（しいたけ杯）- Exclusive theme
    ];

    static init(): void {
        const ServiceUserInfo = AssemblyHelper.AssemblyCSharp.class("Sonolus.Core.Service.ServiceUserInfo");

        // @ts-ignore
        ServiceUserInfo.method<void>(".ctor", 5).implementation = this.ServiceUserInfoHook;

        Logger.info("[UserInfoSpoof::init] Initialized");
    }

    private static ServiceUserInfoHook(
        this: Il2Cpp.Object,
        Profile: Il2Cpp.Object,
        GemCount: number,
        VipEndAt: number,
        NameChangeCount: number,
        Themes: Il2Cpp.Array<Il2Cpp.String>
    ): void {
        Logger.hook(`ServiceUserInfo::.ctor called`);
        if (!Config.spoofEnabled) {
            this.method<void>(".ctor", 5).invoke(Profile, GemCount, VipEndAt, NameChangeCount, Themes);
            return;
        }

        const spoofedVipEndAt = UserInfoSpoof.spoofedVipEndAt;
        const spoofedThemes = UserInfoSpoof.spoofedThemes;

        this.method<void>(".ctor", 5).invoke(Profile, GemCount, spoofedVipEndAt, NameChangeCount, spoofedThemes);
    }

    private static get spoofedVipEndAt(): number {
        return Date.now() + UserInfoSpoof.SPOOFED_VIP_DURATION_DAYS * UserInfoSpoof.MS_PER_DAY;
    }

    private static get spoofedThemes(): Il2Cpp.Array<Il2Cpp.String> {
        const themes: ContentTheme[] | null = ContentSystem.themes;
        if (!themes) {
            const themesArray: Il2Cpp.Array<Il2Cpp.String> = Il2Cpp.array(System.String, this.FALLBACK_THEMES.length);
            this.FALLBACK_THEMES.forEach((name, index) => {
                themesArray.set(index, Il2Cpp.string(name));
            });
            Logger.warn("[UserInfoSpoof::spoofedThemes] ContentSystem.themes is not available, using fallback");
            return themesArray;
        }

        const themesArray: Il2Cpp.Array<Il2Cpp.String> = Il2Cpp.array(System.String, themes.length);
        themes.forEach((theme, index) => {
            themesArray.set(index, Il2Cpp.string(theme.name));
        });
        return themesArray;
    }
}
