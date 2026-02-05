import type { FC } from "react";
import { Outlet } from "react-router";
import { NavBar } from "./NavBar";

export const MainLayout: FC = () => {
    return (
        <div>
            <div className="absolute w-full top-0 left-0">
                <NavBar />
            </div>
            <div className="w-full h-full pt-11">
                <Outlet />
            </div>
        </div>
    )
}