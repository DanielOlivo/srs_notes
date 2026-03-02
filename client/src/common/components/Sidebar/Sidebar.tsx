import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router";

export const Sidebar: FC = () => {

    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(state => !state)

    const navigate = useNavigate()

    return (
    <div className="drawer">
        <input 
            id="my-drawer-1" 
            type="checkbox" 
            className="drawer-toggle" 
            checked={isOpen}
            onChange={toggle}
        />
        <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-1" className="drawer-button">
                <Bars3Icon className="size-6" />
            </label>
        </div>
        <div className="drawer-side">
            <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>

            <ul className="menu menu-md min-h-full w-80 p-4 pt-6 bg-base-200">
                <li>
                    <span
                        onClick={() => {
                            navigate("/srs_notes/docs")
                            toggle()
                        }}
                    >Documents</span>
                </li>

                <li><span onClick={() => {
                    navigate("/srs_notes/settings")
                    toggle()
                }}>Settings</span></li>

                <li><span onClick={() => {
                    navigate("/srs_notes/backup")
                    toggle()
                }}>Backup</span></li>

                <li><span onClick={() => {
                    navigate("/srs_notes/dev")
                    toggle()
                }}>Development</span></li>

                <li><span onClick={() => {
                    navigate("/srs_notes/about")
                    toggle()
                }}>About</span></li>
            </ul>
        </div>
    </div>
    )
}