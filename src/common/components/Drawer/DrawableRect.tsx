import { useContext, type FC } from "react";
import { DrawerContext } from "./drawerContext";
import { normalizeRectFromTwoPoints, rectToStyle } from "./utils";

export const DrawableRect: FC = () => {
    const { selectors: { selectIsDrawingMode } } = useContext(DrawerContext)

    const mode = selectIsDrawingMode()
    if(!mode) return null

    const { start, current } = mode
    const rect = normalizeRectFromTwoPoints(start, current)

    return (
        <div
            style={rectToStyle(rect, 'blue')}
        />
    )
}