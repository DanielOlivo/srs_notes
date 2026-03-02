import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router";

export const OnNoteEdit: FC = () => {

    const { docId, noteId } = useParams<{docId: string, noteId: string}>()
    const navigate = useNavigate()

    return (
        <>
            <div className="flex-none">
                <button
                    onClick={() => navigate(-1)} 
                ><ArrowLeftCircleIcon className="size-6" /></button>
            </div>

            <div className="Edit note">
                <span>Edit note</span>
            </div>

            <div className="flex-1" />
        </>
    )
}