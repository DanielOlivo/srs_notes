import type { FC } from "react";
import { useGetGridListQuery } from "../../grid.api";
import { GridListItem } from "./GridListItem";

export const GridList: FC = () => {

    const { data: grids, isLoading, isError } = useGetGridListQuery();

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError){
        return <div>Error occurred</div>
    }

    if(!grids || grids.length === 0){
        return <div>List is empty</div>
    }

    return (
        <ul className="list ">
            {grids.map(grid => <GridListItem key={grid.id} {...grid} />)}
        </ul>
    )
}