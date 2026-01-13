import { createContext } from "react";
import { initState, useGrid } from "./useGrid";
import { Vector2 } from "../../../utils/Coord";

export const GridContext = createContext<ReturnType<typeof useGrid>>({
    position: Vector2.zero,
    isMouseDown: false,
    viewRef: { current: null },
    coords: [],
    overHandler: null,
    overCoord: Vector2.zero,
    getItemPosition: () => Vector2.zero,
    state: initState,
    handlers: {
        handleMouseDown: () => {},
        handleMouseUp: () => {},
        handleMouseMove: () => {},
        handleClickCapture: () => {},
        handleItemEnter: () => () => {},
        handleHandlerEnter: () => () => {},
        handleHandlerLeave: () => () => {},
    } 
})