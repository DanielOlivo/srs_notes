import type { FC } from "react";
import { useGetAllNotesQuery } from "../note.api";
import { NoteItem } from "./NoteItem";

export const NoteList: FC = () => {

    const { data: noteList, isLoading, isError, error } = useGetAllNotesQuery();

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError && error){
        return <div>
            <span>something went wrong</span>
            {error && <span>{JSON.stringify(error)}</span>}
        </div>
    }

    if(!noteList){
        return <div>Empty list</div>
    }

    return (
        <ul>
            {noteList.notes.map(note => <NoteItem key={note.id} {...note} />)}
        </ul>
    );
}