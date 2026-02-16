import { ChevronDownIcon, ChevronUpIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Link } from "react-router";

interface AddNoteProps {
    idx: number
    destination: "above" | "below"
}

export const AddNote: FC<AddNoteProps> = ({idx, destination}) => {

    const target = `addNote/${destination === 'above' ? idx : idx + 1}/0`

    return (
        <Link 
            to={target} 
            className="flex flex-row items-center text-secondary-content border rounded-4xl"
        >
            <PlusCircleIcon className="size-6" /> 
            {
                destination === 'above'
                ? <ChevronUpIcon className="size-6" />
                : <ChevronDownIcon className="size-6" />
            } 
        </Link>
    )
}