import { AssemblyHelper } from "../../../../../engine/AssemblyHelper";
import { Dep } from "../../../reactivity/Dep";
import { ImgLblBtn } from "../ImgLblBtn";
import { Field } from "./Field";

/**
 * `Sonolus.UI.Common.Fields.BtnField` - field with value text + action buttons (extends Field)
 *
 * @requires Title, Value, Btns
 */
export class BtnField extends Field {
    protected static override _class: Il2Cpp.Class | null = null;

    static override get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.AssemblyCSharp.class("Sonolus.UI.Common.Fields.BtnField"));
    }

    static new(): BtnField {
        const obj = this._new<BtnField>();
        obj.setRequired(["title", "value", "btns"]);
        return obj;
    }

    value(value: Dep<Il2Cpp.String>): this {
        this.method<void>("SetValue", 1).invoke(value);
        this.setMark("value");
        return this;
    }

    /**
     * Actually, you can pass in `btns` arguments not only ImgLblBtn  
     * I don't know why Sonolus typed it as only ImgLblBtn, but you can use other widgets too  
     *
     * So for `ImgBtn` use:
     * ```ts
     * .btns([ImgBtn.new() as ImgLblBtn])
     * ```
     */
    btns(btns: ImgLblBtn[]): this {
        const buttonsArray = Il2Cpp.array<ImgLblBtn>(ImgLblBtn.class, btns.length);
        btns.forEach((btn, i) => buttonsArray.set(i, btn));
        this.method<void>("SetBtns", 1).invoke(buttonsArray);
        this.setMark("btns");
        return this;
    }
}
