import type { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentMode } from "../grid.selectors";
import { selectMode, type ModeName } from "../grid.slice";

export const ModeSelector: FC = () => {

    const dispatch = useAppDispatch();
    const currentMode = useAppSelector(selectCurrentMode);

    const modeNames: ModeName[] = ['normal', 'edit', 'review']

    return (
        <div className="flex flex-col justify-start items-start my-2">
            {modeNames.map(name => (
                <button
                    style={{
                        color: name === currentMode.kind ? "black" : "gray"
                    }} 
                    onClick={() => dispatch(selectMode(name))}
                >{name}</button>
            ))}
        </div>
    )
}