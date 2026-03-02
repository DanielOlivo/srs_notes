import { PencilIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Link } from "react-router";

interface EditNoteButtonProps {
    noteId: string
    disabled: boolean
}

export const EditNoteButton: FC<EditNoteButtonProps> = ({noteId, disabled}) => {

    return <Link
        to={`noteEdit/${noteId}`}
        className="text-secondary"
        style={{
            pointerEvents: disabled ? "none" : "auto"
        }}
    >
        <PencilIcon className="size-6" />
    </Link>
}