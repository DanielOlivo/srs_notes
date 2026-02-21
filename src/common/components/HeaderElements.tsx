import type { FC } from "react";
import { BackButton } from "./BackButton/BackButton";
import { Sidebar } from "./Sidebar/Sidebar";

export interface HeaderElementsProps {
    buttonType: "back" | "sidebar"
    title: string
}

export const HeaderElements: FC<HeaderElementsProps> = ({buttonType, title}) => {
    return (
        <>
            <div className="flex-none">
                {buttonType === "back" ? <BackButton /> : <Sidebar />}
            </div>

            <div className="flex-grow">
                <span>{title}</span>
            </div>
        </>
    )
}