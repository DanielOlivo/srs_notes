import { useEffect, useState, type FC } from "react";
import type { NoteType } from "../../noteTypes";
import { BasicNoteEdit } from "../BasicNoteEdit/BasicNoteEdit";
import { useLazyGetNoteQuery } from "../../note.api";
import { TextNoteEdit } from "../TextNote/TextNoteEdit";
import { useAppDispatch } from "../../../app/hooks";
import { setListMode } from "../../../List/list.slice";
import { useParams } from "react-router";
import type { IVector2 } from "../../../utils/Vector2";

// export interface NoteEditProps {
//     id?: string
// }

export const NoteEdit: FC = () => {

    const { docId, noteId: id, posY, posX } = useParams<{docId: string, noteId: string, posX: string, posY: string}>()

    const dispatch = useAppDispatch()
    const [mode, setMode] = useState<NoteType | null>(id !== undefined ? null : 'basic')
    const [getNote, { data: note} ] = useLazyGetNoteQuery()

    const getChangeHandler = (noteType: NoteType) => () => setMode(noteType)

    const noteTypes: NoteType[] = ['basic', 'text']

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
        <div className="grid grid-cols-3">

            <div className="col-span-2">
                <h2>Note {id ? "Editing" : "Creating"}</h2>
            </div>

            <div>
                <button
                    onClick={() => dispatch(setListMode({kind: 'edit'}))} 
                >Close</button>
            </div>

            {!id && <div className="col-span-3 flex flex-row justify-between items-center">
                {noteTypes.map(t => (
                    <div key={t} className="flex flex-row justify-start items-center">
                        <input 
                            type="radio" 
                            name="noteType" 
                            value={t}
                            checked={mode === t}
                            onChange={getChangeHandler(t)}
                        />
                        <label>{t}</label>
                    </div>
                ))}
            </div>}

            <div className="col-span-3 h-11">
                {getForm(mode ?? note?.kind ?? 'basic')}
            </div>

        </div>
    )
}