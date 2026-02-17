import type { FC } from "react";
import { Note } from "../../notes/components/Note/Note";
import { useAppSelector } from "../../app/hooks";
import { selectMode } from "../list.selectors";
import { AddNote } from "./AddNote/AddNote";
import { EditNoteButton } from "./EditNoteButton/EditNoteButton";

export interface ListItemProps {
    id: string
    idx: number
    refFn: (el: HTMLLIElement) => void
}

/**
 * controls the size of the elmeent
 * @param id - note id
 * @returns 
 */
export const ListItem: FC<ListItemProps> = ({id, idx, refFn}) => {

    const mode = useAppSelector(selectMode)
    const controlsDisabled = mode.kind === 'onAnswer'

    return (
        <li 
            className="w-full
                flex flex-col
                justify-start items-stretch
                rounded-lg 
                my-2 p-1
                shadow-lg
            "
            data-id={id}
            ref={refFn}
        >
            <div className="flex flex-row justify-end items-center gap-2">
                <EditNoteButton noteId={id} disabled={controlsDisabled} />
                <AddNote idx={idx} destination='above' disabled={controlsDisabled} /> 
            </div>

            <div className="grow">
                <Note id={id} />
            </div>

            <div className="flex flex-row justify-end items-center">
                <AddNote idx={idx} destination='below' disabled={controlsDisabled} /> 
            </div>
        </li>
    )
}