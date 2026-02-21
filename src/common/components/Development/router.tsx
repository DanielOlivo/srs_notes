import { Development } from "./Development";
import { DevelopmentHeaderElements } from "./DevelopmentHeaderElements";

export const developmentRouterPath = {
    path: "dev",
    Component: Development,
    handle: {
        header: <DevelopmentHeaderElements />
    }
}