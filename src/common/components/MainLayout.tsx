import type { FC } from "react";
import { Outlet } from "react-router";
import { NavBar } from "./NavBar";
import { useAppSelector } from "../../app/hooks";
import { selectIsDark } from "../../theme/theme.selector";
import { useTheme } from "../../theme/useTheme";

export const MainLayout: FC = () => {

    const { isDark } = useTheme()

    return (
        <div>
            <div className="absolute w-full top-0 left-0">
                <NavBar />
            </div>
            <div className="w-full h-full pt-11">
                <Outlet />
            </div>

            <div className="absolute overflow-hidden size-0">
                <input 
                    className="theme-controller toggle" 
                    type="checkbox" 
                    value='dark' 
                    checked={isDark} />
            </div>
        </div>
    )
}