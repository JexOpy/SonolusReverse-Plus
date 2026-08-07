import { FilePicker } from "../../../engine/native/FilePicker";
import { Path } from "../../../engine/native/Path";
import { SectionsHook } from "../../../sonolus/routes/SectionsHook";
import { Assets } from "../../../sonolus/wrappers/Assets";
import { Dep } from "../../../sonolus/wrappers/reactivity/Dep";
import { Ref } from "../../../sonolus/wrappers/reactivity/Ref";
import { BtnField } from "../../../sonolus/wrappers/ui/common/fields/BtnField";
import { ImgBtn } from "../../../sonolus/wrappers/ui/common/ImgBtn";
import { ImgLblBtn } from "../../../sonolus/wrappers/ui/common/ImgLblBtn";
import { PopupExtensions } from "../../../sonolus/wrappers/ui/popup/PopupExtensions";
import { WidgetUtils } from "../../../sonolus/wrappers/ui/WidgetUtils";
import { Config } from "../../data/Config";
import { CustomBgm } from "../../features/CustomBgm";
import { I18n } from "../../i18n/I18n";
import { createUndoBtn } from "../../utils/BtnHelpers";

function displayName(path: string): string {
    return path === "" ? I18n.t("ui.bgm.default") : Path.getFileNameWithoutExtension(path);
}

let bgmValueRef: Ref<Il2Cpp.String> | null = null;

function getBgmValueRef(): Ref<Il2Cpp.String> {
    if (!bgmValueRef) bgmValueRef = Ref.create(displayName(Config.customBgmPath));
    return bgmValueRef;
}

function setBgmValue(path: string): void {
    getBgmValueRef().value = Il2Cpp.string(displayName(path));
}

function importBtnOnClick(): () => void {
    return () => {
        FilePicker.pickFile(
            (path: Il2Cpp.String) => {
                if (!path.isNull() && path.content) {
                    const filePath = path.content;
                    const distPath = Path.customBgmPath + Path.getFileNameFromPath(filePath);

                    Path.createDirectory(Path.customBgmPath);
                    Path.move(filePath, distPath);
                    Config.customBgmPath = distPath;
                    setBgmValue(distPath);
                    Config.save();
                    CustomBgm.restartBgm();
                    PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.bgm.popup.success"));
                }
            },
            ["audio"]
        );
    };
}

function importBtn(): ImgLblBtn {
    return ImgLblBtn.new()
        .title(I18n.tRef("ui.bgm.import_button"))
        .icon(Dep.opImplicit(Assets.getAsset("Import")))
        .onClick(importBtnOnClick())
        .validate();
}

function undoBtn(): ImgBtn {
    const btn = createUndoBtn()
        .onClick(() => {
            Config.customBgmPath = "";
            setBgmValue("");
            Config.save();
            CustomBgm.restartBgm();
            PopupExtensions.showHelp(SectionsHook.router, I18n.t("ui.bgm.popup.reset"));
        })
        .validate();

    return WidgetUtils.margin(btn, 20, 0, 0, 0) as ImgBtn;
}

export function bgmField(): BtnField {
    return BtnField.new()
        .title(I18n.tRef("ui.bgm.title"))
        .description(I18n.tRef("ui.bgm.description"))
        .value(getBgmValueRef())
        .btns([importBtn(), undoBtn() as ImgLblBtn])
        .validate();
}
