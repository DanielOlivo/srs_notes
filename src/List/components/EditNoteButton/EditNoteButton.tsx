import { PencilIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Link } from "react-router";

interface EditNoteButtonProps {
    noteId: string
}

export const EditNoteButton: FC<EditNoteButtonProps> = ({noteId}) => {

    return <Link
        to={`noteEdit/${noteId}`}
        className="text-secondary-content"
    >
        <PencilIcon className="size-6" />
    </Link>
}