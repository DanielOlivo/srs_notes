import { useContext, useMemo, type FC } from "react";
import { Vector2, type IVector2 } from "../../../../utils/Coord";
import { SimpleGridContext } from "../useSimpleGrid";

export interface CellProps {
    coord: IVector2
}

export const Cell: FC<CellProps> = ({coord}) => {

    const { position } = useContext(SimpleGridContext)

    const pos = useMemo(() => Vector2.sub(coord, position), [coord, position])

    return (
        <div>
            <span>{coord.x} {coord.y}</span>
        </div>
    )
}