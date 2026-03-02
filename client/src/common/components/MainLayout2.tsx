import { createElement, type ComponentType, type FC } from "react";
import { useTheme } from "../../theme/useTheme";
import { Outlet, useMatches, type RouteMatch } from "react-router";

// type Headerhandle = {
//     header: ComponentType
// }

export const MainLayout2: FC = () => {
    const { isDark } = useTheme()

    const matches = useMatches() //as Array<RouteMatch<string, Headerhandle>>
    const header = (matches
        .slice()
        .reverse()
        .find(m => (m.handle as any)?.header)
        ?.handle as any)?.header;

    return (
        <div className="h-screen">

            <header className="absolute w-full top-0 left-0">
                <div className="navbar bg-base-100 shadow-sm">
                    {/* <Outlet context="header" /> */}
                    {/* {header && createElement(header)} */}
                    {header}
                </div>
            </header>

            <div className="w-full max-h-full flex flex-row justify-center items-center">
                <div className="max-w-5xl max-h-full pt-17">
                    <Outlet />
                </div>
            </div>

            <div className="absolute overflow-hidden size-0">
                <input 
                    className="theme-controller toggle" 
                    type="checkbox" 
                    value='dark' 
                    defaultChecked={isDark}
                    checked={isDark} />
            </div>
        </div>
    )
}