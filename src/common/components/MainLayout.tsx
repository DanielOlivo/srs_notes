import type { FC } from "react";
import { Outlet } from "react-router";
import { NavBar } from "./NavBar";
import { useAppSelector } from "../../app/hooks";
import { selectIsDark } from "../../theme/theme.selector";
import { useTheme } from "../../theme/useTheme";

export const MainLayout: FC = () => {

    const { isDark } = useTheme()

    return (
        <div className="h-screen">
            <div className="absolute w-full top-0 left-0">
                <NavBar />
            </div>

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
                    checked={isDark} />
            </div>
        </div>
    )
}