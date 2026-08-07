import { AssemblyHelper } from "../../../engine/AssemblyHelper";
import { Widget } from "./Widget";

// TODO: move this to classes like how it's actually work in Sonolus src

/** `Sonolus.UI.WidgetUtils` - static helper class for `Sonolus.UI.Widget` */
export class WidgetUtils {
    private static _class: Il2Cpp.Class | null = null;

    static get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.AssemblyCSharp.class("Sonolus.UI.WidgetUtils"));
    }

    static margin<T extends Widget>(widget: T, left: number, top: number, right: number, bottom: number): Il2Cpp.Object {
        return this.class.method<Il2Cpp.Object>("Margin", 5).inflate(Widget.class).invoke(widget, left, top, right, bottom);
    }

    static children<T extends Widget>(widget: T, children: Widget[]): Il2Cpp.Object {
        const childrenArray = Il2Cpp.array<Widget>(widget.class, children.length);
        children.forEach((c, i) => childrenArray.set(i, c));

        return this.class.method<Il2Cpp.Object>("Children", 2).inflate(Widget.class).invoke(widget, childrenArray);
    }
}
