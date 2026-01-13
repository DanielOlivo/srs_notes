import type { FC } from "react";
import { useNavigate } from "react-router";
import { type GridItemDto } from "../../grid.dto";
import dayjs from "dayjs";

export interface GridListItemProps {
    id: string
    name: string
}

export const GridListItem: FC<GridItemDto> = ({id, name, createdAt}) => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/grid/${id}`)
    }

    return (
        <li 
            onClick={handleClick}
            className="list-row"
        >
            <div className="list-col-grow">
                <button>{name}</button>
            </div>
            <div>
                <span>{dayjs(createdAt).format("YYYY MMMM D")}</span>
            </div>
            <div>
                <button className="btn">Delete</button>
            </div>
        </li>
    )
}