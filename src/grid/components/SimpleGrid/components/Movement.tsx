import { useCallback, useContext, type FC } from "react";
import { SimpleGridContext } from "../useSimpleGrid";
import { Vector2, type IVector2 } from "../../../../utils/Coord";

export const Movement: FC = () => {
    const { move } = useContext(SimpleGridContext)    

    const getMoveFn = useCallback((delta: IVector2) => () => move(delta), [move])

    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-4">
            <div className="col-start-2">
                <button onClick={getMoveFn(Vector2.up)}>Up</button>
            </div>

            <div className="row-start-2">
                <button onClick={getMoveFn(Vector2.left)}>Left</button>
            </div>

            <div className="col-start-3 row-start-2">
                <button onClick={getMoveFn(Vector2.right)}>Right</button>
            </div>

            <div className="col-start-2 row-start-3">
                <button onClick={getMoveFn(Vector2.down)}>Down</button>
            </div>
        </div>
    
    )
}