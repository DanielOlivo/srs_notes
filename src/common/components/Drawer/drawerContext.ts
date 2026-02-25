import { createContext, useEffect, useRef, useState, type MouseEvent, type MouseEventHandler, type RefObject } from "react";
import { getDefault, reducer, type Action, type RectId } from "./utils";
import type { Rect } from "../../entities/Rect";
import { Vector2, type IVector2 } from "../../../utils/Vector2";

const getRelativePercentCoord = (e: MouseEvent, container: HTMLDivElement): IVector2 => {
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    return new Vector2(x, y).asPlain()
}

export const useDrawerFns = (src: string, rects: Rect[]) => {
    const [state, setState] = useState(getDefault(src, rects))
    const dispatch = (action: Action) => setState(reducer(state, action))
    const containerRef = useRef<HTMLDivElement>(null)    

    const canvasHandlers: {[K: string]: MouseEventHandler<HTMLDivElement>} = {

        onMouseDown: (e) => {
            if(!containerRef.current) return
            const coord = getRelativePercentCoord(e, containerRef.current)
            dispatch({ kind: 'startDrawing', coord })
        },

        onMouseMove: (e) => {
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
        },

        onMouseUp: (e) => {
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
        }
    }

    const getRectHandlers = (id: string): {[K: string]: MouseEventHandler<HTMLDivElement>} => ({
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
    })

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

    const selectors = {
        selectSrc: () => state.data.src,
        selectRects: () => state.data.rects,
        // selectRect: (id: RectId) => state.data.rects[id],
        selectIsSelected: (id: RectId) => state.mode.kind === 'idle' && state.mode.selected === id,
        selectIsDrawingMode: () => state.mode.kind === 'drawing' ? state.mode : null,
        selectRect: (id: RectId) => {
            if(state.mode.kind === 'dragging' && state.mode.id === id){
                const rect = state.data.rects[id]
                const { delta, coord } = state.mode
                return {...rect, left: coord.x - delta.x, top: coord.y - delta.y}
            }
            return state.data.rects[id]
        }
    }

    return {
        state,
        containerRef,
        // dispatch: (action: Action) => setState(reducer(state, action)), 
        canvasHandlers,
        getRectHandlers,
        selectors,
    }
}


type IDrawerContext = Pick<ReturnType<typeof useDrawerFns>, "canvasHandlers" | "getRectHandlers" | "selectors">

const dummy: IDrawerContext = {
    canvasHandlers: {},
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