import { useCallback, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setListMode, type ListMode, type ListState } from "../../list.slice";
import { selectMode } from "../../list.selectors";
import { Link } from "react-router";

export const Controls: FC = () => {

    const dispatch = useAppDispatch()
    const currentMode = useAppSelector(selectMode)
    


    const setMode = (mode: ListState['mode']) => () => {
        dispatch(setListMode(mode))
    } 

    const modeSelectionButtonStyle = useCallback((mode: ListMode): React.CSSProperties => ({
        color: mode === currentMode ? "green" : "white"
    }), [currentMode])

    return (
        <div className="flex flex-col justify-start items-center">

            <div className="flex flex-row justify-between items-center gap-4">

                <button 
                    onClick={setMode('normal')}
                    style={modeSelectionButtonStyle('normal')}
                >Normal</button>

                <button 
                    onClick={setMode('review')}
                    style={modeSelectionButtonStyle('review')}
                >Review</button>

                <button 
                    onClick={setMode('edit')}
                    style={modeSelectionButtonStyle('edit')}
                >Edit</button>
            </div>

            {currentMode === 'edit' && (
                <Link to='add'>Add</Link>
            )}

        </div>
    )
}