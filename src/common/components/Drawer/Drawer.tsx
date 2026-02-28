import { useEffect, useMemo, type FC } from "react";
import { RectComponent } from "./Rect";
import { DrawerContext, useDrawerFns } from "./drawerContext";
import type { IRect } from "../../entities/Rect";
import { DrawableRect } from "./DrawableRect";

type DrawerProps = {
    src: string,
    rects: IRect[],
    onChange?: (rects: IRect[]) => void
}

export const Drawer: FC<DrawerProps> = ({src, rects, onChange}) => {
    
    // const { state, containerRef, ...hooks } = useDrawerFns(src, rects)   
    const drawerFns = useDrawerFns(src, rects)
    const { containerRef} = drawerFns
    // const [onInit, setOnInit] = useState(true)
    const contextValue = useMemo(() => {
        const { state: _, containerRef: _cr, ...rest} = drawerFns
        return rest
    }, [drawerFns])
    const { 
        canvasHandlers: { onMouseDown, onMouseMove, onMouseUp },
        selectors: { selectRects }
    } = contextValue

    // const setOnInitEffect = useEffectEvent(() => setOnInit(false))

    useEffect(() => {
        onChange?.(Object.values(drawerFns.state.data.rects))
    }, [drawerFns.state.data.rects])

    return (
        <DrawerContext.Provider value={contextValue}>
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