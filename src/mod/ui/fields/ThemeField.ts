import { FilePicker } from "../../../engine/native/FilePicker";
import { Path } from "../../../engine/native/Path";
import { SectionsHook } from "../../../sonolus/routes/SectionsHook";
import { Assets } from "../../../sonolus/wrappers/Assets";
import { Dep } from "../../../sonolus/wrappers/reactivity/Dep";
import { Ref } from "../../../sonolus/wrappers/reactivity/Ref";
import { Theme } from "../../../sonolus/wrappers/theme/Theme";
import { ThemeSystem } from "../../../sonolus/wrappers/theme/ThemeSystem";
import { BtnField } from "../../../sonolus/wrappers/ui/common/fields/BtnField";
import { ImgLblBtn } from "../../../sonolus/wrappers/ui/common/ImgLblBtn";
import { PopupExtensions } from "../../../sonolus/wrappers/ui/popup/PopupExtensions";
import { WidgetUtils } from "../../../sonolus/wrappers/ui/WidgetUtils";
import { Constants } from "../../data/Constants";
import { ThemeLoader } from "../../data/ThemeLoader";
import { CustomThemes } from "../../features/CustomThemes";
import { I18n } from "../../i18n/I18n";
import { createOkBtn } from "../../utils/BtnHelpers";

function themeValueRef(): Ref<Il2Cpp.String> {
    // currentTheme: Ref<Theme> .value: Theme .title: Dep<Il2Cpp.String> .value: Il2Cpp.String .content: string | null
    // const valueRef: Ref<Il2Cpp.String> = Ref.create(ThemeSystem.currentTheme.value.title.value.content ?? "unknown");
    // refactored cuz reading issue
    const currentThemeRef: Ref<Theme> = ThemeSystem.currentTheme;
    const themeTitleDep: Dep<Il2Cpp.String> = currentThemeRef.value.title;
    const titleStr: string = themeTitleDep.value.content ?? "unknown";

    const valueRef: Ref<Il2Cpp.String> = Ref.create(titleStr);
    currentThemeRef.hook(() => {
        const theme: Theme = currentThemeRef.value;
        valueRef.value = theme.title.value;
    });

    return valueRef;
}

function refreshThemes(): void {
    CustomThemes.refreshThemes();
    PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.theme.popup.message"));
}

function onThemeImportPicked(): void {
    FilePicker.pickFile(
        (path: Il2Cpp.String) => {
            if (!path.isNull() && path.content) {
                const filePath = path.content;
                const distPath = Path.customThemesPath + Path.getFileNameFromPath(filePath);

                Path.move(filePath, distPath);
                const status = ThemeLoader.importTheme(distPath);

                if (status !== 0) {
                    PopupExtensions.showError(SectionsHook.router, I18n.t("ui.theme.popup.message_error"), [createOkBtn()]);
                } else {
                    refreshThemes();
                }
            }
        },
        ["json"]
    );
}

function refreshThemeBtn(): ImgLblBtn {
    return ImgLblBtn.new()
        .title(I18n.tRef("ui.theme.refresh_button"))
        .icon(Dep.opImplicit(Assets.getAsset("Refresh")))
        .onClick(() => refreshThemes())
        .validate();
}

function importThemeBtn(): ImgLblBtn {
    const btn = ImgLblBtn.new()
        .title(I18n.tRef("ui.theme.import_button"))
        .icon(Dep.opImplicit(Assets.getAsset("Import")))
        .onClick(() => onThemeImportPicked())
        .validate();

    return WidgetUtils.margin(btn, 20, 0, 0, 0) as ImgLblBtn;
}

function themeBtn(): ImgLblBtn {
    const btn = ImgLblBtn.new()
        .title(I18n.tRef("ui.theme.select_button"))
        .icon(Dep.opImplicit(Assets.getAsset("Theme")))
        .enabled(false)
        .validate();

    return WidgetUtils.margin(btn, 20, 0, 0, 0) as ImgLblBtn;
}

export function themeField(): BtnField {
    return BtnField.new()
        .title(I18n.tRef("ui.theme.title"))
        .description(I18n.tRef("ui.theme.description", ThemeLoader.loadedThemes.size, Path.customThemesPath, Constants.WIKI_URL))
        .value(themeValueRef())
        .btns([refreshThemeBtn(), importThemeBtn(), themeBtn()])
        .validate();
}
