import type { FC } from "react";
import { useNavigate } from "react-router";

export interface GridListItemProps {
    id: string
    name: string
}

export const GridListItem: FC<GridListItemProps> = ({id, name}) => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/grid/${id}`)
    }

    return (
        <li onClick={handleClick}>
            <span>{name}</span>
        </li>
    )
}