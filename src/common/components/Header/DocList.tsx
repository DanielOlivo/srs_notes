import { Bars3Icon } from "@heroicons/react/24/outline";
import type { FC } from "react";

export const DocList: FC = () => {
    return (
        <>
            <div className="flex-none">
                <button

                ><Bars3Icon className="size-6" /> </button>
            </div>
            <div className="flex-none">
                <span>SRS Notes</span>
            </div> 

            <div className="flex-none px-4">
                <span>Documents</span> 
            </div>

            <div className="flex-1" />
        </>
    )
}