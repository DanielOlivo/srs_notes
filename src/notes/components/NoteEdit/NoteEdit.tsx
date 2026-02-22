import { useEffect, useState, type FC } from "react";
import type { NoteType } from "../../noteTypes";
import { BasicNoteEdit } from "../BasicNoteEdit/BasicNoteEdit";
import { useLazyGetNoteQuery } from "../../note.api";
import { TextNoteEdit } from "../TextNote/TextNoteEdit";
import { useNavigate, useParams } from "react-router";
import type { IVector2 } from "../../../utils/Vector2";
import { DeleteNoteButton } from "../DeleteNoteButton/DeleteNoteButton";
import { ImageNoteEdit } from "../ImageNote/ImageNoteEdit";
import { ClozeNoteEdit } from "../ClozeNote/ClozeNoteEdit";

// export interface NoteEditProps {
//     id?: string
// }

export const NoteEdit: FC = () => {

    const navigate = useNavigate()
    const { docId, noteId: id, posY, posX } = useParams<{docId: string, noteId: string, posX: string, posY: string}>()

    // const dispatch = useAppDispatch()
    const [mode, setMode] = useState<NoteType | null>(id !== undefined ? null : 'basic')
    const [getNote, { data: note} ] = useLazyGetNoteQuery()

    const getChangeHandler = (noteType: NoteType) => () => setMode(noteType)

    const noteTypes: NoteType[] = ['basic', 'text', 'image', 'cloze']

    const coord: IVector2 = {
        x: parseInt(posX ?? "0"),
        y: parseInt(posY ?? "0")
    }


    const getForm = (noteType: NoteType) => {
        switch(noteType){
            case "basic":
                return <BasicNoteEdit id={id} docId={docId} coord={coord} />
            case "text":
                return <TextNoteEdit id={id} docId={docId} coord={coord} />
            case "image":
                return <ImageNoteEdit id={id} docId={docId} coord={coord} />
            case 'cloze':
                return <ClozeNoteEdit id={id} docId={docId} coord={coord} />
            default:
                return <div>no form for this type</div>
        }
    }

    useEffect(() => {
        if(id !== undefined){
            getNote(id)
        }
    }, [id, getNote])

    return (
        <div className="flex flex-col items-center justify-start gap-3">

            {!id && (
                <div className="join">
                    {noteTypes.map(t => (
                            <input 
                                type="radio" 
                                name="noteType" 
                                className="join-item btn"
                                aria-label={t}
                                value={t}
                                checked={mode === t}
                                onChange={getChangeHandler(t)}
                            />
                    ))}
                </div>
            )}

            <div className="">
                {getForm(mode ?? note?.kind ?? 'basic')}
            </div>

            <div>
                {id !== undefined && (
                    <DeleteNoteButton id={id} onAfter={() => navigate(-1)} />
                )}
            </div>
        </div>
    )
}