import { AssemblyHelper } from "../../../../engine/AssemblyHelper";
import { System } from "../../../../engine/System";
import { Texture2D } from "../../../../engine/wrappers/Texture";
import { Dep } from "../../reactivity/Dep";
import { CompositeWidget } from "../CompositeWidget";
import { BtnType } from "./BtnType";

/**
 * `Sonolus.UI.Common.ImgBtn` - button with icon (extends CompositeWidget)
 *
 * @requires Icon
 */
export class ImgBtn extends CompositeWidget {
    protected static override _class: Il2Cpp.Class | null = null;

    static override get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.AssemblyCSharp.class("Sonolus.UI.Common.ImgBtn"));
    }

    static new(): ImgBtn {
        const obj = this._new<ImgBtn>();
        obj.setRequired(["icon"]);
        return obj;
    }

    icon(icon: Dep<Texture2D>): this {
        this.method<void>("SetIcon", 1).invoke(icon);
        this.setMark("icon");
        return this;
    }

    type(type: BtnType): this {
        this.method<void>("SetType", 1).invoke(type);
        return this;
    }

    enabled(enabled: boolean): this {
        this.method<void>("SetEnabled", 1).invoke(Dep.opImplicit(enabled));
        return this;
    }

    onClick(onClick: () => void): this {
        this.method<void>("SetOnClick", 1).invoke(Il2Cpp.delegate(System.Action, onClick));
        return this;
    }
}
