import { Logger } from "../../utils/Logger";
import { Platform } from "../../utils/Platform";
import { AssemblyHelper } from "../AssemblyHelper";
import { System } from "../System";

/*
 * Wrapper over https://github.com/yasirkula/UnityNativeFilePicker
 * But there's no ConvertExtensionToFileType (why? omg Sonolus)
 */

export class FilePicker {
    private static tag = "FilePicker";

    private static readonly MIME_MAP: Record<string, string> = {
        json: "application/json",
        audio: "audio/*",
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg"
    };

    private static readonly UTI_MAP: Record<string, string> = {
        json: "public.json",
        audio: "public.audio",
        mp3: "public.mp3",
        wav: "com.microsoft.waveform-audio",
        ogg: "org.xiph.ogg-audio"
    };

    protected static _class: Il2Cpp.Class | null = null;

    static get class(): Il2Cpp.Class {
        return (this._class ??= AssemblyHelper.NativeFilePicker.class("NativeFilePicker"));
    }

    /**
     * Prompts the user to pick a file from the available document providers
     *
     * Wrapper over `NativeFilePicker.PickFile(FilePickedCallback callback, System.String[] allowedFileTypes)`
     *
     * @param allowedFileTypes e.g. ["json"]
     */
    static pickFile(callback: (path: Il2Cpp.String) => void, allowedFileTypes: string[]): void {
        if (this.isFilePickerBusy()) {
            Logger.warn(`[${this.tag}::pickFile] FilePicker is busy`);
            return;
        }

        const callbackClass = FilePicker.class.nested("FilePickedCallback");
        const delegate = Il2Cpp.delegate(callbackClass, callback);

        const typesArray = Il2Cpp.array(System.String, allowedFileTypes.length);
        allowedFileTypes.forEach((extension, index) => {
            typesArray.set(index, Il2Cpp.string(FilePicker.getFileTypeFromExtension(extension)));
        });

        FilePicker.class.method<void>("PickFile", 2).invoke(delegate, typesArray);
    }

    /**
     * Prompts the user to export a file to the available document providers
     *
     * Wrapper over `NativeFilePicker.ExportFile(System.String filePath, FilesExportedCallback callback = null)`
     */
    static exportFile(filePath: string, callback?: (success: boolean) => void): void {
        if (this.isFilePickerBusy()) {
            Logger.warn(`[${this.tag}::exportFile] FilePicker is busy`);
            return;
        }

        const method = FilePicker.class.method<void>("ExportFile", 2);

        if (callback) {
            const callbackClass = FilePicker.class.nested("FilesExportedCallback");
            const delegate = Il2Cpp.delegate(callbackClass, callback);
            method.invoke(Il2Cpp.string(filePath), delegate);
        } else {
            method.invoke(Il2Cpp.string(filePath), ptr(0));
        }
    }

    /**
     * Converts a file extension to its corresponding MIME on Android and UTI on iOS
     * @param extension don't include the period in extension, i.e. use `png` instead of `.png`
     *
     */
    private static getFileTypeFromExtension(extension: string): string {
        if (Platform.isPlatformAndroid()) {
            return this.MIME_MAP[extension] ?? "";
        } else {
            return this.UTI_MAP[extension] ?? "";
        }
    }

    /**
     * if `true` another PickFile, PickMultipleFiles, ExportFile or ExportMultipleFiles request will simply be ignored
     *
     * @returns `true` if the user is currently importing/exporting files
     */
    private static isFilePickerBusy(): boolean {
        return FilePicker.class.method<boolean>("IsFilePickerBusy", 0).invoke();
    }
}
