import { useRef, useState, type FC } from "react";
import type { BasicNoteDto, UpdateBasicNoteDto } from "../notes.dto";
import { useDeleteBasicNoteMutation, useUpdateBasicNoteMutation } from "../note.api";

export const NoteItem: FC<BasicNoteDto> = ({id, front, back}) => {

    const [update, ] = useUpdateBasicNoteMutation();
    const [deleteNote, ] = useDeleteBasicNoteMutation();
    const [onEdit, setOnEdit] = useState(false);

    const frontRef = useRef<HTMLInputElement>(null);
    const backRef = useRef<HTMLInputElement>(null);


    const handleUpdate = () => {
        if(!frontRef.current || !backRef.current) return
        const dto: UpdateBasicNoteDto = {
            id,
            front: frontRef.current.value,
            back: backRef.current.value
        }
        update(dto);
        setOnEdit(false);
    }

    const handleDelete = () => deleteNote(id);

    return (
        <li>
            <span>{id}</span> 

            <input
                ref={frontRef}
                disabled={!onEdit}
                defaultValue={front}
            />

            <input
                ref={backRef}
                disabled={!onEdit}
                defaultValue={back}
            />

            {!onEdit ? (
                <button onClick={() => setOnEdit(true)}>Edit</button>
            ) : (
                <button onClick={handleUpdate}>Save</button>
            )}

            <button onClick={handleDelete}>Delete</button>
        </li>
    )
}