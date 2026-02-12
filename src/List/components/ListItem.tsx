import type { FC } from "react";
import { Note } from "../../notes/components/Note/Note";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { useAppSelector } from "../../app/hooks";
import { selectMode } from "../list.selectors";

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

    const showEditButton = mode.kind === 'edit' || mode.kind === 'onUpdate'

    return (
        <li 
            className="w-full h-20 
                flex justify-between items-center 
                border rounded-xl border-slate-300
                my-2 py-1
            "
            data-id={id}
            ref={refFn}
        >
            <div className="grow">
                <Note id={id} />
            </div>

            <div className="flex-none w-6">
                {showEditButton &&
                    <>
                        <button
                            popoverTarget={`popover-${id}`} 
                            style={{ anchorName: `--anchor-${id}`} as React.CSSProperties}
                        >
                            <EllipsisVerticalIcon className="size-5" />
                        </button>

                        <ul 
                            className="dropdown dropdown-end menu w-28 rounded-box bg-base-200"
                            popover="auto"
                            id={`popover-${id}`}
                            style={{ positionAnchor: `--anchor-${id}`} as React.CSSProperties}
                        >
                            <li><Link to={`addNote/${idx}/0`}>add above</Link></li>
                            <li><Link to={`noteEdit/${id}`}>edit</Link></li>
                            <li><Link to={`addNote/${idx + 1}/0`}>add below</Link></li>
                        </ul>
                    </>
                }
            </div>
        </li>
    )
}