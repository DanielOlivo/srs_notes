import type { FC } from "react";
import type { GridItemDto } from "../../grid/grid.dto";
import { useDeleteGridMutation } from "../../grid/grid.api";

export const GridItem: FC<GridItemDto> = ({id, name, createdAt}) => {

    const [deleteGrid, ] = useDeleteGridMutation()

    return (
        <tr>
            <th className="text-ellipsis overflow-hidden max-w-36 text-nowrap">{id}</th>
            <td>{name}</td>
            <td>{createdAt}</td>
            <td>
                <button 
                    onClick={() => deleteGrid(id)}
                    className="btn"
                >Delete</button>
            </td>
        </tr>
    )
}