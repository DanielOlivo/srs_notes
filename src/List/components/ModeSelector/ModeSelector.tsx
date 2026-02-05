import { useCallback, type FC } from "react";
import { useParams } from "react-router";
import { setListMode, type ListMode2 } from "../../list.slice";
import { useAppDispatch } from "../../../app/hooks";

export const ModeSelector: FC = () => {

    const { docId } = useParams<{docId: string}>()
    const dispatch = useAppDispatch()

    const getClickHandler = (mode: ListMode2['kind']) => () => {
        const nextMode: ListMode2 = (() => {
            switch(mode){
                case "edit": return { kind: "edit"}
                case "onReview": return { kind: "onReview" }
                default: return { kind: "none"}
            }
        })()
        dispatch(setListMode(nextMode))
    }

    if(!docId)
        return null

    return (
        <div
            className="fab fab-flower"
        >
            <div tabIndex={0} role="button" className="btn btn-lg btn-info btn-circle">M</div>

            <div className="fab-close">
                <span className="btn btn-circle btn-lg btn-error">X</span>
            </div>

            <div className="tooptip" data-tip="Normal">
                <button 
                    className="btn btn-lg btn-circle btn-info"
                    onClick={getClickHandler('none')}
                >N</button>
            </div>

            <div className="tooptip" data-tip="Review">
                <button 
                    className="btn btn-lg btn-circle btn-info"
                    onClick={getClickHandler('onReview')}
                >R</button>
            </div>

            <div className="tooptip" data-tip="Edit">
                <button 
                    className="btn btn-lg btn-circle btn-info"
                    onClick={getClickHandler('edit')}
                >E</button>
            </div>
        </div>
    )
}