import { About } from "./About";
import { AboutHeaderElements } from "./AboutHeaderElements";

export const aboutRouterPath = {
    path: "about",
    Component: About,
    handle: {
        header: <AboutHeaderElements />
    }
}