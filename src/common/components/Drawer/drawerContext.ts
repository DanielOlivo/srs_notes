import { createContext, useCallback, useEffect, useEffectEvent, useMemo, useRef, useState, type MouseEvent, type MouseEventHandler, type RefObject } from "react";
import { getDefault, reducer, type Action, type RectId } from "./utils";
import type { IRect } from "../../entities/Rect";
import { Vector2, type IVector2 } from "../../../utils/Vector2";

const getRelativePercentCoord = (e: MouseEvent, container: HTMLDivElement): IVector2 => {
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return new Vector2(x, y).asPlain()
}

type Handler = MouseEventHandler<HTMLDivElement>

export const useDrawerFns = (src: string, rects: IRect[]) => {
    const [state, setState] = useState(() => getDefault(src, rects))
    const dispatch = useCallback((action: Action) => setState(reducer(action)), [])
    const containerRef = useRef<HTMLDivElement>(null)    

    const setStateEffect = useEffectEvent(setState)

    const [isFirst, setIsFirst] = useState(true)

    useEffect(() => {
        // if(isFirst){
            setStateEffect(getDefault(src, rects))
        //     setIsFirst(false)
        // }
    }, [src, rects]);

    const canvasOnMouseDown: Handler = useCallback((e) => {
        if(!containerRef.current) return
        const coord = getRelativePercentCoord(e, containerRef.current)
        dispatch({ kind: 'startDrawing', coord })
    }, [dispatch])

    const canvasOnMouseMove: Handler = useCallback((e) => {
        if(!containerRef.current) return
        const coord = getRelativePercentCoord(e, containerRef.current)
        switch(state.mode.kind){
            case 'drawing': {
                dispatch({ kind: 'drawing', coord })
                break;
            }
            case 'dragging': {
                dispatch({ kind: 'drag', coord })
                break;
            }
        }
    }, [dispatch, state.mode.kind]);

    const canvasOnMouseUp: Handler = useCallback((e) => {
        if(!containerRef.current) return
        switch(state.mode.kind){
            case 'dragging': {
                dispatch({ kind: 'stopDrag' })
                break;
            }
            case 'drawing': {
                const coord = getRelativePercentCoord(e, containerRef.current)
                dispatch({ kind: 'stopDrawing', coord })
                break;
            }
        }
    }, [dispatch, state.mode.kind])

    const canvasHandlers = useMemo(() => ({
        onMouseDown: canvasOnMouseDown,
        onMouseMove: canvasOnMouseMove,
        onMouseUp: canvasOnMouseUp
    }), [canvasOnMouseDown, canvasOnMouseMove, canvasOnMouseUp])

    // const canvasHandlers: {[K: string]: MouseEventHandler<HTMLDivElement>} = {

    //     onMouseDown: (e) => {
    //         if(!containerRef.current) return
    //         const coord = getRelativePercentCoord(e, containerRef.current)
    //         dispatch({ kind: 'startDrawing', coord })
    //     },

    //     onMouseMove: (e) => {
    //         if(!containerRef.current) return
    //         const coord = getRelativePercentCoord(e, containerRef.current)

    //         switch(state.mode.kind){
    //             case 'drawing': {
    //                 dispatch({ kind: 'drawing', coord })
    //                 break;
    //             }
    //             case 'dragging': {
    //                 dispatch({ kind: 'drag', coord })
    //                 break;
    //             }
    //         }
    //     },

    //     onMouseUp: (e) => {
    //         if(!containerRef.current) return
    //         switch(state.mode.kind){
    //             case 'dragging': {
    //                 dispatch({ kind: 'stopDrag' })
    //                 break;
    //             }
    //             case 'drawing': {
    //                 const coord = getRelativePercentCoord(e, containerRef.current)
    //                 dispatch({ kind: 'stopDrawing', coord })
    //                 break;
    //             }
    //         }
    //     }
    // }

    const getRectHandlers = useCallback((id: string): {[K: string]: MouseEventHandler<HTMLDivElement>} => ({
        onMouseDown: e => {
            e.stopPropagation()
            if(!containerRef.current) return
            const coord = getRelativePercentCoord(e, containerRef.current)
            const rect = state.data.rects[id]
            const delta = {
                x: coord.x - rect.left,
                y: coord.y - rect.top
            }
            dispatch({ kind: 'startDrag', id, delta, coord})
        },

        onClick: e => {
            e.stopPropagation()
            dispatch({ kind: 'select', id })
        }
    }), [dispatch, state.data.rects])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            switch(e.key){
                case 'Delete': case 'Backspace': {
                    if(state.mode.kind === 'idle' && state.mode.selected){
                        dispatch({ kind: 'deleteRect', id: state.mode.selected })
                    }
                    break;
                }
                case 'Escape': {
                    dispatch({kind: 'deselect' })
                    break;
                }
            }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [state])

    const selectSrc = useCallback(() => state.data.src, [state.data.src])
    const selectRects = useCallback(() => state.data.rects, [state.data.rects])
    const selectRect = useCallback((id: RectId) => {
        if(state.mode.kind === 'dragging' && state.mode.id === id){
            const rect = state.data.rects[id]
            const { delta, coord } = state.mode
            return {...rect, left: coord.x - delta.x, top: coord.y - delta.y}
        }
        return state.data.rects[id]
    }, [state])
    const selectIsSelected = useCallback(
        (id: RectId) => state.mode.kind === 'idle' && state.mode.selected === id
    , [state.mode]) 
    const selectIsDrawingMode = useCallback(
        () => state.mode.kind === 'drawing' ? state.mode : null
    , [state.mode])

    const selectors = useMemo(() => ({
        selectSrc,
        selectRects,
        selectIsSelected,
        selectIsDrawingMode,
        selectRect,
    }), [selectSrc, selectRects, selectRect, selectIsSelected, selectIsDrawingMode])

    return {
        state,
        containerRef,
        canvasHandlers,
        getRectHandlers,
        selectors,
    }
}


type IDrawerContext = Pick<ReturnType<typeof useDrawerFns>, "canvasHandlers" | "getRectHandlers" | "selectors">

const dummy: IDrawerContext = {
    canvasHandlers: {
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseUp: () => {}
    },
    getRectHandlers: () => ({}),
    selectors: {
        selectIsSelected: () => false,
        selectRects: () => ({}),
        selectRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
        selectSrc: () => "",
        selectIsDrawingMode: () => null
    }
}

export const DrawerContext = createContext(dummy)