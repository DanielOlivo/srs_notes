import type { FC } from "react";
import { Movement } from "./Movement";

export const GridControl: FC = () => {

    return (
        <div className="flex flex-col justify-start items-center">
            <Movement />
        </div>
    )
}