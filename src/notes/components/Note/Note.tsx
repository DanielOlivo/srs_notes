import type { FC } from "react";
import { useGetNoteQuery } from "../../note.api";
import { BasicNote } from "../BasicNote/BasicNote";
import { TextNote } from "../TextNote/TextNote";
import { ImageNoteComponent } from "../ImageNote/ImageNote";

export interface NoteProps {
    id: string
}

/**
 * The special component which fetches the note itself and decides which component to render (Basic note, Text note or Image note)
 * @param id - note id 
 */
export const Note: FC<NoteProps> = ({id}) => {
    const { data: note, isLoading, isError } = useGetNoteQuery(id)  

    if(isError || !note){
        return <div>Error occurred</div>
    }

    switch(note.kind){
        case "basic":
            return <BasicNote {...note} />
        case 'text':
            return <TextNote {...note} />
        case 'image':
            return <ImageNoteComponent {...note} />
        default: 
            return <div>Unknown note type</div>
    }
}