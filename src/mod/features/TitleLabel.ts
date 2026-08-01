import { AssemblyHelper } from "../../engine/AssemblyHelper";
import { TitleHook } from "../../sonolus/ui/TitleHook";
import { App } from "../../sonolus/wrappers/App";
import { Dep } from "../../sonolus/wrappers/reactivity/Dep";
import { Logger } from "../../utils/Logger";

export class TitleLabel {
    static init(): void {
        const Lbl = AssemblyHelper.AssemblyCSharp.class("Sonolus.UI.Common.Lbl");

        // Sonolus.UI.Common.Lbl Title(Sonolus.Reactivity.Dep<string> title);
        const LblTitle = Lbl.method<Il2Cpp.Object>("Title", 1);

        // @ts-ignore
        LblTitle.implementation = this.lblTitleHook;

        Logger.info("[TitleLabel::init] Initialized");
    }

    private static lblTitleHook(this: Il2Cpp.Object, title: Il2Cpp.Object): Il2Cpp.Object {
        if (TitleHook.inTitleSetup) {
            const value: Il2Cpp.String = Object.setPrototypeOf(title, Dep.prototype).value;

            if (!value.isNull() && value.content === App.semVer) {
                // or we can re-use value.content
                const newTitle: Dep<Il2Cpp.String> = Dep.opImplicit(`Reverse | ${App.semVer}`);
                return this.method<Il2Cpp.Object>("Title", 1).invoke(newTitle);
            }
        }

        return this.method<Il2Cpp.Object>("Title", 1).invoke(title);
    }
}
