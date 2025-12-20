import type { FC } from "react";
import { useGetNoteCreate } from "./CreateNote";
import { noteTypes } from "../noteTypes";

export const NoteTypeSelector: FC = () => {

    const {noteType,setNoteType} = useGetNoteCreate();

    return (
        <div>
            {noteTypes.map(type => (
                <button
                    onClick={() => {
                        if(type !== noteType){
                            setNoteType(type)
                        }
                    }} 
                >{type}</button>
            ))}
        </div>
    )
}