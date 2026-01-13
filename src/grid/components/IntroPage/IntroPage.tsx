import type { FC } from "react";
import { GridList } from "../GridList/GridList";
import { GridCreateButton } from "../GridCreate/GridCreateButton";

export const IntroPage: FC = () => {
    return (
        <div>
            <GridList />
            <GridCreateButton />
        </div>
    )
}