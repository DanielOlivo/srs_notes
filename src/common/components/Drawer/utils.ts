import { v4 } from "uuid"
import type { IVector2 } from "../../../utils/Vector2"
import type { Rect } from "../../entities/Rect"
import type { CSSProperties } from "react"

/*
I'm making a tiny drawer react component, and I need some help regarding callbacks.



*/

export type RectId = string

type Mode = "idle" | "edit"

type DrawerData = { 
    data: {
        rects: {[K: RectId]: Rect}
        src: string
    }
}

type Idle = { kind: 'idle', selected?: RectId}

type OnDrawing = {
    kind: 'drawing' 
    start: IVector2
    current: IVector2
}

type OnDragging = {
    kind: 'dragging'
    id: RectId
    coord: IVector2
    delta: IVector2
}

type Editing = { mode: Idle | OnDrawing | OnDragging }

export type DrawerState = DrawerData & Editing

export const getDefault = (src: string, rects: Rect[]): DrawerState => ({
    data: {
        rects: Object.fromEntries(rects.map(r => [v4(), r])),
        src
    },
    mode: { kind: 'idle' }
})

export const selectSelected = (state: DrawerState): RectId | null => {
    switch(state.mode.kind){
        case 'idle': return state.mode.selected ?? null
        case 'dragging': return state.mode.id
        default: return null
    }
}

type StartDrawing = { kind: 'startDrawing', coord: IVector2 }
type Drawing = { kind: 'drawing', coord: IVector2 }
type StopDrawing = { kind: 'stopDrawing', coord: IVector2 }

type StartDrag = { kind: 'startDrag', id: RectId, delta: IVector2, coord: IVector2 }
type Drag = { kind: 'drag', coord: IVector2 }
type StopDrag = { kind: 'stopDrag' }

type SelectRect = { kind: 'select', id: RectId }
type Deselect = { kind: 'deselect'}
type DeleteRect = { kind: 'deleteRect', id: RectId }

export type Action =
    | StartDrawing
    | Drawing
    | StopDrawing
    | StartDrag
    | Drag
    | StopDrag
    | SelectRect
    | Deselect
    | DeleteRect

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v))

export const rectToStyle = (r: Rect, color: string): CSSProperties => ({
    position: 'absolute',
    left: `${r.left}%`,
    top: `${r.top}%`,
    width: `${r.width}%`,
    height: `${r.height}%`,
    backgroundColor: color
})
    
export const normalizeRectFromTwoPoints = (a: IVector2, b: IVector2): Rect => {
    const left = Math.min(a.x, b.x)
    const top = Math.min(a.y, b.y)
    const right = Math.max(a.x, b.x)
    const bottom = Math.max(a.y, b.y)
    return { left, top, width: right - left, height: bottom - top }
}



export const reducer = (state: DrawerState, action: Action): DrawerState => {

    switch(state.mode.kind){

        case 'idle': {
            switch(action.kind){

                case 'startDrawing': return {
                    ...state,
                    mode: { 
                        kind: 'drawing', 
                        start: action.coord, 
                        current: action.coord 
                    }
                }

                case 'startDrag': return {
                    ...state,
                    mode: {
                        kind: 'dragging',
                        id: action.id,
                        delta: action.delta,
                        coord: action.coord
                    }
                }

                case 'select': {
                    return {
                        ...state,
                        mode: { kind: 'idle', selected: action.id }
                    }
                }

                case 'deselect': return {
                    ...state,
                    mode: { kind: 'idle' }
                }

                case 'deleteRect': {
                    const { [action.id]: _, ...remainingRects } = state.data.rects;
                    return {
                        ...state,
                        data: {
                            ...state.data,
                            rects: remainingRects,
                        },
                        mode: { kind: 'idle', selected: undefined }
                    };
                }

                default: return state
            }
        }

        case 'drawing': {
            switch(action.kind) {
                case 'drawing': return {
                    ...state,
                    mode: { kind: 'drawing', start: state.mode.start, current: action.coord }
                }

                case 'stopDrawing':  {
                    const newRect: Rect = {
                        left: Math.min(state.mode.start.x, state.mode.current.x),
                        top: Math.min(state.mode.start.y, state.mode.current.y),
                        width: Math.abs(state.mode.start.x - state.mode.current.x),
                        height: Math.abs(state.mode.start.y - state.mode.current.y)
                    }

                    // avoid small rects
                    if(newRect.width < 5 || newRect.height < 5){
                        return {
                            ...state,
                            mode: { kind: 'idle' }
                        }
                    }

                    const newId = v4();
                    return {
                        ...state,
                        data: {
                            ...state.data,
                            rects: {
                                ...state.data.rects,
                                [newId]: newRect
                            },
                        },
                        mode: { kind: 'idle', selected: newId }
                    }
                }

                default: return state
            }
        }

        case 'dragging': {
            switch(action.kind){
                case 'drag': {
                    return {
                        ...state,
                        mode: {
                            ...state.mode,
                            coord: action.coord
                        }
                    }
                }

                case 'stopDrag': {
                    const rect = state.data.rects[state.mode.id]
                    const updRect = {
                        ...rect,
                        left: state.mode.coord.x - state.mode.delta.x,
                        top: state.mode.coord.y - state.mode.delta.y
                    }

                    const updRects = {...state.data.rects, [state.mode.id]: updRect}
                    return {
                        ...state,
                        data: {
                            ...state.data,
                            rects: updRects,
                        },
                        mode: { kind: 'idle', selected: state.mode.id }
                    }
                }

                default: return state
            }
        }

        default: return state
    }
}
