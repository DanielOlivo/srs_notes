import type { FC } from "react";
import { useAnswerMutation, useGetNoteQuery } from "../../../notes/note.api";
import { isBasicNote } from "../../../db/entities/Note";
import { Ease } from "../../../Game/Ease";

export interface AnswerPanelProps {
    noteId: string
}

export const AnswerPanel: FC<AnswerPanelProps> = ({noteId}) => {

    const { data: note } = useGetNoteQuery(noteId)
    const [sendAsnwer, ] = useAnswerMutation()

    const getAnswerHandler = (ease: Ease) => () => {
        sendAsnwer({ noteId, ease })
    }

    const answers: Ease[] = [Ease.Bad, Ease.Hard, Ease.Good, Ease.Easy]

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