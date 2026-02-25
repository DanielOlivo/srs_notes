import { useEffect, type FC } from "react";
import { RectComponent } from "./Rect";
import { DrawerContext, useDrawerFns } from "./drawerContext";
import type { Rect } from "../../entities/Rect";
import { DrawableRect } from "./DrawableRect";

type DrawerProps = {
    src: string,
    rects: Rect[],
    onChange?: (rects: Rect[]) => void
}

export const Drawer: FC<DrawerProps> = ({src, rects, onChange}) => {
    
    const { state, containerRef, ...hooks } = useDrawerFns(src, rects)   
    const { 
        canvasHandlers: { onMouseDown, onMouseMove, onMouseUp },
        selectors: { selectRects }
    } = hooks

    useEffect(() => {
        onChange?.(Object.values(state.data.rects))
    }, [state.data.rects, onChange])

    return (
        <DrawerContext.Provider value={hooks}>
            <div 
                className="relative w-full h-full"
                ref={containerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
            >
                <img src={src} className="object-contain w-full select-none" draggable={false}/>

                {
                    Object.keys(selectRects()).map(id => (
                        <RectComponent key={id} id={id} />
                    ))
                } 

                <DrawableRect />
            </div>
        </DrawerContext.Provider>
    )
}