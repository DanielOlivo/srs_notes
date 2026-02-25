import { useContext, type FC } from "react";
import { rectToStyle, type RectId } from "./utils";
import { DrawerContext } from "./drawerContext";

type RectState = {
    id: RectId
}

export const RectComponent: FC<RectState> = ({id}) => {

    const {
        selectors: {
            selectIsSelected,
            selectRect,
        },
        getRectHandlers,
    } = useContext(DrawerContext) 

    const { onMouseDown, onClick } = getRectHandlers(id)

    return (
        <div
            onClick={onClick}
            onMouseDown={onMouseDown}
            style={rectToStyle(selectRect(id), selectIsSelected(id) ? 'red' : 'orange')}
        >
        </div>
    )
}