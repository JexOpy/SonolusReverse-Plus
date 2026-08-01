import { ModPreferences } from "../data/ModPreferences";

export class Version {
    static get major(): number {
        const major = ModPreferences.VERSION.split(".").at(0);
        return major ? Number(major) : 0;
    }

    static get minor(): number {
        const minor = ModPreferences.VERSION.split(".").at(1);
        return minor ? Number(minor) : 0;
    }

    static get patch(): number {
        const patch = ModPreferences.VERSION.replace(/-/g, ".").split(".").at(2);
        return patch ? Number(patch) : 0;
    }

    static isNewerThan(latest: string, current: string): boolean {
        const l = latest.replace(/-/g, ".").split(".").map(Number);
        const c = current.replace(/-/g, ".").split(".").map(Number);
        for (let i = 0; i < Math.max(l.length, c.length); i++) {
            const lv = l[i] ?? 0;
            const cv = c[i] ?? 0;
            if (lv > cv) return true;
            if (lv < cv) return false;
        }
        return false;
    }
}
