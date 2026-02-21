import { Settings } from "./Settings";
import { SettingsHeaderElements } from "./SettingsHeaderElements";

export const settingsRouterPath = {
    path: "settings",
    Component: Settings,
    handle: {
        header: <SettingsHeaderElements />
    }
}