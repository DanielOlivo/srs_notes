import { useState, type FC } from "react";
import { getInitState, NoteCreateContext } from "../hooks";
import { NoteTypeSelector } from "./NoteTypeSelector";
import { CreateBasicNote } from "./CreateBasicNote";
import type { NoteType } from "../noteTypes";
import { TextNoteEdit } from "./TextNote/TextNoteEdit";
import { ImageNoteEdit } from "./ImageNote/ImageNoteEdit";
import { ImageOcclusionNote } from "./ImageOccluzsionNote/ImageOcclusionNote";
import { ImageOcclusionNoteEdit } from "./ImageOccluzsionNote/ImageOcclusionNoteEdit";
import { ClozeNoteEdit } from "./ClozeNote/ClozeNoteEdit";

export const CreateNote: FC = () => {

    const [noteCreate, setNoteCreate] = useState(getInitState())

    const handleNoteType = (type: NoteType) => {
        switch(type){
            case 'basic': return <CreateBasicNote />
            case "text": return  <TextNoteEdit />// <div>create text note form</div>
            case "image": return <ImageNoteEdit />// <div>create image note form</div>
            case "cloze": return <ClozeNoteEdit />
            case "imageOcclusion": return <ImageOcclusionNoteEdit />
        }
    }

    return (
        <NoteCreateContext.Provider value={noteCreate}>
            <div className="">
                <NoteTypeSelector />
                {handleNoteType(noteCreate.noteType)}
            </div>
        </NoteCreateContext.Provider>
    )
}