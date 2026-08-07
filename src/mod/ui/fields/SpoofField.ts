import { ToggleField } from "../../../sonolus/wrappers/ui/common/fields/ToggleField";
import { Config } from "../../data/Config";
import { I18n } from "../../i18n/I18n";

export function spoofField(): ToggleField {
    const valueRef = Config.registerOrGet("spoofEnabled", Config.spoofEnabled);

    // prettier-ignore
    return ToggleField.new()
        .title(I18n.tRef("ui.spoof.title"))
        .description(I18n.tRef("ui.spoof.description"))
        .value(valueRef)
        .validate();
}
