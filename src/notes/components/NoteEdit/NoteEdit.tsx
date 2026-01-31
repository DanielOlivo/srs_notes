import { useEffect, useState, type FC } from "react";
import type { NoteType } from "../../noteTypes";
import { BasicNoteEdit } from "../BasicNoteEdit/BasicNoteEdit";
import { useLazyGetNoteQuery } from "../../note.api";
import { TextNoteEdit } from "../TextNote/TextNoteEdit";
import { useAppDispatch } from "../../../app/hooks";
import { setEditMode } from "../../../List/list.slice";

export interface NoteEditProps {
    id?: string
}

export const NoteEdit: FC<NoteEditProps> = ({id}) => {

    const dispatch = useAppDispatch()
    const [mode, setMode] = useState<NoteType | null>(id !== undefined ? null : 'basic')
    const [getNote, { data: note} ] = useLazyGetNoteQuery()

    const getChangeHandler = (noteType: NoteType) => () => setMode(noteType)

    const noteTypes: NoteType[] = ['basic', 'text']

    const getForm = (noteType: NoteType) => {
        switch(noteType){
            case "basic":
                return <BasicNoteEdit id={id} />
            case "text":
                return <TextNoteEdit id={id} />
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
                {/* <Link to="..">Close</Link>  */}
                <button
                    onClick={() => dispatch(setEditMode({kind: 'none'}))} 
                >Close</button>
            </div>

            {!id && <div className="col-span-3 flex flex-row justify-between items-center">
                {noteTypes.map(t => (
                    <div className="flex flex-row justify-start items-center">
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