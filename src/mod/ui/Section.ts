import { FilePicker } from "../../engine/native/FilePicker";
import { Path } from "../../engine/native/Path";
import { Application } from "../../engine/wrappers/Application";
import { SectionsHook } from "../../sonolus/routes/SectionsHook";
import { Assets } from "../../sonolus/wrappers/Assets";
import { Dep } from "../../sonolus/wrappers/reactivity/Dep";
import { RouteSection } from "../../sonolus/wrappers/routing/RouteSection";
import { BtnField } from "../../sonolus/wrappers/ui/common/fields/BtnField";
import { ToggleField } from "../../sonolus/wrappers/ui/common/fields/ToggleField";
import { ImgLblBtn } from "../../sonolus/wrappers/ui/common/ImgLblBtn";
import { Rows } from "../../sonolus/wrappers/ui/common/Rows";
import { CustomSection } from "../../sonolus/wrappers/ui/common/sections/CustomSection";
import { SectionBase } from "../../sonolus/wrappers/ui/common/sections/SectionBase";
import { PopupExtensions } from "../../sonolus/wrappers/ui/popup/PopupExtensions";
import { Widget } from "../../sonolus/wrappers/ui/Widget";
import { WidgetUtils } from "../../sonolus/wrappers/ui/WidgetUtils";
import { Config } from "../data/Config";
import { Constants } from "../data/Constants";
import { ModPreferences } from "../data/ModPreferences";
import { ThemeLoader } from "../data/ThemeLoader";
import { CustomBgm } from "../features/CustomBgm";
import { UpdateChecker } from "../features/UpdateChecker";
import { I18n } from "../i18n/I18n";
import { Version } from "../utils/version";
import { SectionUtils } from "./SectionUtils";

export class CustomSectionMod {
    private static readonly SECTION_ICON_NAME: string = "IconStar";
    private static _versionPopupShown: boolean = false;

    static buildCustomSection(): RouteSection {
        // Show popup if outdated version
        const latest = UpdateChecker.latestVersion;
        if (!this._versionPopupShown && latest && Version.isNewerThan(latest, ModPreferences.VERSION)) {
            PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.about.popup.update_available"));
            this._versionPopupShown = true;
        }

        const title = this.title();
        const spoofField = this.spoofField();
        const versionField = this.versionField();
        const themeField = this.themeField();
        const bgmField = this.bgmField();
        const aboutField = this.aboutField();

        const rows = Rows.new().gap(20).children([title, spoofField, versionField, themeField, bgmField, aboutField]);

        const section = CustomSection.new().content(rows).validate();

        const icon = Dep.opImplicit(Assets.getAsset(this.SECTION_ICON_NAME));
        const route = RouteSection.new(icon, section);
        return route;
    }

    private static title(): Widget {
        // later this information will be in About Tab
        return SectionBase.createTitle(
            /// #if DEV
            I18n.tRef("ui.title_dev", ModPreferences.VERSION, ModPreferences.BUILD, ModPreferences.HASH, ModPreferences.ENV),
            /// #else
            // @ts-ignore
            I18n.tRef("ui.title", ModPreferences.VERSION)
            /// #endif
        );
    }

    private static spoofField(): ToggleField {
        const valueRef = Config.registerOrGet("spoofEnabled", Config.spoofEnabled);

        return ToggleField.new().title(I18n.tRef("ui.spoof.title")).description(I18n.tRef("ui.spoof.description")).value(valueRef).validate();
    }

    private static versionField(): ToggleField {
        const valueRef = Config.registerOrGet("versionCheck", Config.versionCheck);

        return ToggleField.new().title(I18n.tRef("ui.version_check.title")).description(I18n.tRef("ui.version_check.description")).value(valueRef).validate();
    }

    private static themeField(): BtnField {
        return BtnField.new()
            .title(I18n.tRef("ui.theme.title"))
            .description(I18n.tRef("ui.theme.description", ThemeLoader.loadedThemes.size, Path.customThemesPath, Constants.WIKI_URL))
            .value(SectionUtils.themeValueRef())
            .btns([this.refreshThemeBtn(), this.importThemeBtn(), this.themeBtn()])
            .validate();
    }

    private static refreshThemeBtn(): ImgLblBtn {
        return ImgLblBtn.new()
            .title(I18n.tRef("ui.theme.refresh_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Refresh")))
            .onClick(() => SectionUtils.refreshAndNotify())
            .validate();
    }

    private static importThemeBtn(): ImgLblBtn {
        const btn = ImgLblBtn.new()
            .title(I18n.tRef("ui.theme.import_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Import")))
            .onClick(() => SectionUtils.onThemeImportPicked())
            .validate();

        return WidgetUtils.margin(btn, 20, 0, 0, 0) as ImgLblBtn;
    }

    private static themeBtn(): ImgLblBtn {
        const btn = ImgLblBtn.new()
            .title(I18n.tRef("ui.theme.select_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Theme")))
            .enabled(false)
            .validate();

        return WidgetUtils.margin(btn, 20, 0, 0, 0) as ImgLblBtn;
    }

    private static aboutField(): BtnField {
        const updateBtn = ImgLblBtn.new()
            .title(I18n.tRef("ui.about.update_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Refresh")))
            .onClick(() => {
                UpdateChecker.checkVersion();
                const latest = UpdateChecker.latestVersion;
                if (!latest) {
                    PopupExtensions.showError(SectionsHook.router, I18n.t("ui.about.popup.checking"), [SectionUtils.okBtn()]);
                    return;
                }

                if (Version.isNewerThan(latest, ModPreferences.VERSION)) {
                    PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.about.popup.update_available"));
                } else {
                    PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.about.popup.up_to_date"));
                }
            })
            .validate();

        let discordBtn = ImgLblBtn.new()
            .title(I18n.tRef("ui.about.discord_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Link")))
            .onClick(() => {
                Application.openURL(Constants.DISCORD_URL);
            })
            .validate();

        discordBtn = WidgetUtils.margin(discordBtn, 20, 0, 0, 0) as ImgLblBtn;

        let githubBtn = ImgLblBtn.new()
            .title(I18n.tRef("ui.about.github_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Link")))
            .onClick(() => {
                Application.openURL(Constants.GITHUB_URL);
            })
            .validate();

        githubBtn = WidgetUtils.margin(githubBtn, 20, 0, 0, 0) as ImgLblBtn;

        return BtnField.new()
            .title(I18n.tRef("ui.about.title"))
            .description(I18n.tRef("ui.about.description", ModPreferences.VERSION, ModPreferences.HASH, ModPreferences.ENV))
            .value(Dep.opImplicit(""))
            .btns([updateBtn, discordBtn, githubBtn])
            .validate();
    }

    // TODO: add value to field (file name)
    private static bgmField(): BtnField {
        const importBtn = ImgLblBtn.new()
            .title(I18n.tRef("ui.bgm.import_button"))
            .icon(Dep.opImplicit(Assets.getAsset("Import")))
            .onClick(() => {
                FilePicker.pickFile(
                    (path: Il2Cpp.String) => {
                        if (!path.isNull() && path.content) {
                            const filePath = path.content;
                            const distPath = Path.customBgmPath + Path.getFileNameFromPath(filePath);

                            Path.createDirectory(Path.customBgmPath);
                            Path.move(filePath, distPath);
                            Config.customBgmPath = distPath;
                            Config.save();
                            CustomBgm.restartBgm();
                            PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.bgm.popup.success"));
                        }
                    },
                    ["audio"]
                );
            })
            .validate();

        const resetBtn = ImgLblBtn.new()
            .title(I18n.tRef("ui.bgm.reset_button"))
            .icon(Dep.opImplicit(Assets.getAsset("IconStar")))
            .onClick(() => {
                Config.customBgmPath = "";
                Config.save();
                CustomBgm.restartBgm();
                PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.bgm.popup.reset"));
            })
            .validate();

        const resetBtnMargin = WidgetUtils.margin(resetBtn, 20, 0, 0, 0) as ImgLblBtn;

        return BtnField.new()
            .title(I18n.tRef("ui.bgm.title"))
            .description(I18n.tRef("ui.bgm.description"))
            .value(Dep.opImplicit(""))
            .btns([importBtn, resetBtnMargin])
            .validate();
    }
}
