import type { FC } from "react";
import { useAnswerMutation, useGetNoteQuery } from "../../../notes/note.api";
import { isBasicNote } from "../../../db/entities/Note";
import type { Ease } from "../../../db/entities/answer";
import { useAppDispatch } from "../../../app/hooks";
import { setListMode } from "../../list.slice";

export interface AnswerPanelProps {
    noteId: string
}

export const AnswerPanel: FC<AnswerPanelProps> = ({noteId}) => {

    const { data: note } = useGetNoteQuery(noteId)
    const [sendAsnwer, ] = useAnswerMutation()
    const dispatch = useAppDispatch()

    const getAnswerHandler = (ease: Ease) => async () => {
        await sendAsnwer({ noteId, ease })
        dispatch(setListMode({kind: "none"})) 
    }

    const answers: Ease[] = ["Again", "Hard", "Good", "Easy"]

    return (
        <div className="flex flex-col items-stretch justify-start gap-2">

            <div className="">
                {note && isBasicNote(note) && <span>{note.back}</span>}
            </div>

            <div className="join grow grid grid-cols-4">
                <button 
                    onClick={getAnswerHandler("Again")}
                    className="join-item btn btn-error"
                >Again</button>

                <button 
                    onClick={getAnswerHandler("Hard")}
                    className="join-item btn btn-warning" 
                >Hard</button>

                <button 
                    onClick={getAnswerHandler("Good")}
                    className="join-item btn btn-success"
                >Good</button>
                
                <button 
                    onClick={getAnswerHandler("Easy")}
                    className="join-item btn btn-info"
                >Easy</button>
            </div>

        </div>
    )
}