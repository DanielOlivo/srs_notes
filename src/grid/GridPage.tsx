import type { FC } from "react";
import { Grid } from "./components/Grid/Grid";
import { ModeSelector } from "./components/ModeSelector";

export const GridPage: FC = () => {
    return (
        <div className="w-full h-full flex flex-row justify-between items-stretch">
            <ModeSelector />
            <Grid />
        </div>
    )
}