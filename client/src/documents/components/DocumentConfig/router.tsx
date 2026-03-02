import { DocumentConfig } from "./DocumentConfig";
import { DocumentConfigHeaderElements } from "./DocumentConfigHeaderElements";

export const documentConfigRouterPath = {
    path: "config",
    Component: DocumentConfig,
    handle: {
        header: <DocumentConfigHeaderElements />
    }

}