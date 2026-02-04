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
        dispatch(setListMode({kind: "onReview"})) 
    }

    const answers: Ease[] = ["Again", "Hard", "Good", "Easy"]

    return (
        <div className="grid grid-cols-4">

            <div className="col-span-4">
                {note && isBasicNote(note) && <span>{note.back}</span>}
            </div>

            {answers.map(a => (
                <div key={a}>
                    <button onClick={getAnswerHandler(a)}>{a}</button>
                </div>
            ))}

        </div>
    )
}