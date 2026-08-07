import { Assets } from "../../sonolus/wrappers/Assets";
import { Dep } from "../../sonolus/wrappers/reactivity/Dep";
import { ImgLblBtn } from "../../sonolus/wrappers/ui/common/ImgLblBtn";
import { I18n } from "../i18n/I18n";

export function okBtn(): ImgLblBtn {
    return ImgLblBtn.new()
        .title(I18n.tRef("ui.theme.popup.ok"))
        .icon(Dep.opImplicit(Assets.getAsset("Check")))
        .validate();
}
