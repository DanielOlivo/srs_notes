import { useCallback, type FC } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setListMode, type ListMode, type ListMode2 } from "../../list.slice";
import { selectMode } from "../../list.selectors";
import { Link } from "react-router";

export const Controls: FC = () => {

    const dispatch = useAppDispatch()
    const currentMode = useAppSelector(selectMode)
    


    const setMode = (mode: ListMode2['kind']) => () => {
        const state = ((): ListMode2 => {
            switch(mode){
                case 'none': return { kind: mode}
                case 'onReview': return { kind: mode}
                case 'edit': return { kind: mode}
                default: return { kind: 'none'}
            }
        })()
        dispatch(setListMode(state))
    } 

    const modeSelectionButtonStyle = useCallback((mode: ListMode): React.CSSProperties => ({
        color: mode === currentMode ? "green" : "white"
    }), [currentMode])

    const modes: ListMode2['kind'][] = ['none', 'onReview', 'edit']

    return (
        <div className="flex flex-col justify-start items-center">

            <div className="flex flex-row justify-start items-center gap-4">

                {modes.map(m => (
                    <div key={m} className="flex flex-row justify-start items-center">
                        <input
                            type="radio"
                            name="mode"
                            value={m}
                            // checked={currentMode.kind === m}
                            onChange={setMode(m)}
                        />
                        <label>{m}</label>
                    </div>
                ))}

                {/* <button 
                    onClick={setMode({kind: 'none'})}
                    style={modeSelectionButtonStyle('normal')}
                >Normal</button>

                <button 
                    onClick={setMode('review')}
                    style={modeSelectionButtonStyle('review')}
                >Review</button>

                <button 
                    onClick={setMode('edit')}
                    style={modeSelectionButtonStyle('edit')}
                >Edit</button> */}
            </div>

            {currentMode.kind === 'edit' && (
                // <Link to='add'>Add</Link>
                <button
                    onClick={() => dispatch(setListMode({kind: 'new'}))} 
                >Add</button>
            )}

        </div>
    )
}