import { Bars3Icon } from "@heroicons/react/24/outline";
import type { FC } from "react";

export const Sidebar: FC = () => {
    return (
    <div className="drawer">
        <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-1" className="drawer-button">
                <Bars3Icon className="size-6" />
            </label>
        </div>
        <div className="drawer-side">
            <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>

            <ul className="menu menu-md bg-slate-800 min-h-full w-80 p-4">
                <li><a>Settings</a></li>
                <li><a>About</a></li>
            </ul>
        </div>
    </div>
    )
}