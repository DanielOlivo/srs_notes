import type { FC } from "react";
import { Link } from "react-router";

export const NavBar: FC = () => {
    return (
        <nav className="w-full flex flex-row justify-between items-center">
           <Link to="docs">Documents</Link>
           {/* <Link to="notes">Notes</Link> */}
           {/* <Link to="grid">Grid</Link> */}
        </nav>
    )
}