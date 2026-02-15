import type { FC } from "react";
import { useDeleteNoteMutation } from "../../note.api";
import { TrashIcon } from "@heroicons/react/24/outline";

export interface DeleteNoteButtonProps {
    id: string
    onAfter: () => void
}

export const DeleteNoteButton: FC<DeleteNoteButtonProps> = ({id, onAfter}) => {

    const [deleteNote, ] = useDeleteNoteMutation()

    return (
        <button
            className="btn btn-error"
            onClick={() => {
                deleteNote(id)
                onAfter()
            }}
        ><TrashIcon className="size-6" /> Delete</button>
    )
}