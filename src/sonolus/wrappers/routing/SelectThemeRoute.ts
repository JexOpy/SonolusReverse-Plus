import { AssemblyHelper } from "../../../engine/AssemblyHelper";
import { Route } from "./Route";

/**
 * `Sonolus.Routes.SelectThemeRoute` - original theme picker screen.
 *
 * Push it as a plain route using `Router.Push(Func<Route>)`
 * Don't set `_onNext`. It's using only for first setup and adds "Next" button
 */
export class SelectThemeRoute extends Route {
    protected static override _class: Il2Cpp.Class | null = null;

    static override get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.AssemblyCSharp.class("Sonolus.Routes.SelectThemeRoute"));
    }

    static new(): SelectThemeRoute {
        const obj = this.class.new();
        return Object.setPrototypeOf(obj, SelectThemeRoute.prototype) as SelectThemeRoute;
    }
}
