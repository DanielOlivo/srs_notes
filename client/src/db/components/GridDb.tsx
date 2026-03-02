import type { FC } from "react";
import { useGetGridListQuery } from "../../grid/grid.api";
import { GridItem } from "./GridItem";
import { CreateGridForm } from "./CreateGridForm";

export const GridDb: FC = () => {
    const {data: gridItems} = useGetGridListQuery()

    return (
        <div>
            <div className="overflow-x-auto">
                <table>
                    <thead>

                    </thead>
                    <tbody>
                        {gridItems?.map(item => <GridItem {...item} />)}
                    </tbody>
                </table>
            </div>
            
            <div>
                <CreateGridForm />   
            </div>

        </div>
    )
}