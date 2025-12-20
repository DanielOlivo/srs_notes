import { useState, type FC } from "react";
import { ModeSelector } from "../ModeSelector";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentMode } from "../../grid.selectors";
import { isEditMode } from "../../grid.slice";

export const GridPallette: FC = () => {

    const currentMode = useAppSelector(selectCurrentMode)
    const [selectedCell, setSelectedCell] = useState(null);

    // when normal - nothing

    // when on edit 
    // show edits when selected

    // when on arrangement

    // when on review
    // when selected - front if closed

    return (
        <div className="flex flex-col justify-start items-stretch">
            <ModeSelector />

            {isEditMode(currentMode) && currentMode.selected !== null && (
                <div>

                </div>
            )}             


        </div>
    )
}