import { BackupHeaderElements } from "./BackupHeaderElements";
import { BackupPage } from "./BackupPage";

export const backupRouterPath = {
    path: "backup",
    Component: BackupPage,
    handle: {
        header: <BackupHeaderElements />
    }
}