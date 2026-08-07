import { AssemblyHelper } from "../../../engine/AssemblyHelper";

/** `Sonolus.Routing.Route` - base class of all routes */
export class Route extends Il2Cpp.Object {
    protected static _class: Il2Cpp.Class | null = null;

    static get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.AssemblyCSharp.class("Sonolus.Routing.Route"));
    }
}
