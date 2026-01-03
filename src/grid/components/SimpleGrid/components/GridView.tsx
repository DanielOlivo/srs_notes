import { useContext, type FC } from "react";
import { SimpleGridContext } from "../useSimpleGrid";
import { Cell } from "./Cell";
import { Vector2 } from "../../../../utils/Coord";

export const GridView: FC = () => {
    const {coords} = useContext(SimpleGridContext)

    return (
        <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-2">
            {coords.map(coord => <Cell
                key={Vector2.toKey(coord)} 
                coord={coord}
            />)}
        </div>
    )
}