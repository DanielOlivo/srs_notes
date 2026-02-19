import type { FC } from "react";
import { useDeleteNoteMutation } from "../../note.api";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router";

export interface DeleteNoteButtonProps {
    id: string
    onAfter: () => void
}

export const DeleteNoteButton: FC<DeleteNoteButtonProps> = ({id, onAfter}) => {

    const { docId } = useParams<{docId: string}>()
    const [deleteNote, ] = useDeleteNoteMutation()

    return (
        <button
            className="btn btn-error"
            onClick={async () => {
                if(docId) await deleteNote({noteId: id, docId})
                onAfter()
            }}
        ><TrashIcon className="size-6" /> Delete</button>
    )
}