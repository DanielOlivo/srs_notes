import type { FC } from "react";
import { Note } from "../../notes/components/Note/Note";

export interface ListItemProps {
    id: string
}

/**
 * controls the size of the elmeent
 * @param id - note id
 * @returns 
 */
export const ListItem: FC<ListItemProps> = ({id}) => {
    return (
        <li className="w-full h-20 flex justify-center items-center">
            <Note id={id} />
        </li>
    )
}