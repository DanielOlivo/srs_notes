import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Vector2 } from "../../../utils/Coord"
import type { Grid2Props } from "./Grid2"
import { type MouseEvent } from "react"

// type Mode = 'normal' | 'edit'

/*
    How it works

    The grid has two states: normal and edit.

    Arguments:
        - swap (coord1: Coord, coord2: Coord): void

    Normal Mode
    In this mode user can only navigate along the grid. 
    
    constants
        - panning threshold

    variables:
        - mode
        - position 1 - internal hook's variable
        - position 2 - is used by component
        - start drag
        - is mouse down
        - is panning
        - over handler: Coord or null
        - dragging: Coord or null
        - draggingDelta: Coord or null

    on mouse down:
        - set is mouse down to true
        - if <over handler> is null:
            - store drag start position, which is current client position from event;
        - if <mode> is edit and <over handler> is not null:
            - set <dragging> to <over handler> value
            - store <drag start> postition from event;

    on mouse move: 
        - if <dragging> is null:
            - get <delta> = <client position> - <start drag> position;
            - if mag of delta larger than <panning threshdld> then set <is panning> to true;
            - set <position2> = <position1> + <delta>;
        - if <dragging> is not null:
            - set <draggingDelta> = <client position> - <start drag> position

    on mouse up:
        - set <is mouse down> to false;
        - if <dragging> is null:
            - set <position1> to value of <position2>;
        - if <dragging> is not null:
            - if <over handler> is not null, calls swap function(<dragging>, <over handler>);
            - dragging set to null

    on mouse enter (for item):
        - if <mode> is "edit" and <dragging> is null, set <over handler> to correspondent coordinate

    on mouse leave (for item):
        - if <mode> is "edit"and <dragging> is null, set <over handler> to null

    on mouse click capture:
        - if <is panning> - stop propagation, then set to false

    on mouse click:
        - ???
*/


// should split the object by update frequency to avoid unnecessary copy operations
// client must be separated
export interface GridState {
    viewSize: {
        width: number
        height: number
    }

    position1: Vector2
    position2: Vector2

    isMouseDown: boolean
    isPanning: boolean
    startDrag: Vector2
    client: Vector2
    overCoord: Vector2

    overHandler: Vector2 | null
    dragging: Vector2 | null
    draggingDelta: Vector2 | null
}

export const initState: GridState = {
    viewSize: { width: 0, height: 0 },
    position1: Vector2.zero,
    position2: Vector2.zero,

    isMouseDown: false,
    isPanning: false,
    startDrag: new Vector2(0, 0),
    client: new Vector2(0, 0),
    overCoord: Vector2.zero,
    
    overHandler: null,
    dragging: null,
    draggingDelta: null
}

export const useGrid = (props: Grid2Props) => {
    const viewRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<GridState>(initState)

    useEffect(() => {
        if(!viewRef.current) return 

        const observer = new ResizeObserver((entries) => {
            for(const entry of entries){
                if(entry.contentBoxSize){
                    const size = entry.contentBoxSize[0]
                    setState(st => ({
                        ...st,
                        viewSize: {
                            width: size.inlineSize,
                            height: size.blockSize
                        }
                    }))
                }
            }
        })

        observer.observe(viewRef.current)

        return () => observer.disconnect()
    }, [viewRef])

    const cellsAlongAxes = useMemo(() => {
        const alongX = Math.ceil(state.viewSize.width / (props.cellSize.width + props.gap)) + 4
        const alongY = Math.ceil(state.viewSize.height / (props.cellSize.height + props.gap)) + 4
        return {alongX, alongY}
    }, [state.viewSize, props])

    const startIndices = useMemo(() => {
        const startX = -Math.floor(state.position1.x / (props.cellSize.width + props.gap)) - 2
        const startY = -Math.floor(state.position1.y / (props.cellSize.height + props.gap)) - 2
        return {startX, startY}
    }, [state.position1, props])

    const coords = useMemo(() => {
        const {alongX, alongY} = cellsAlongAxes
        const {startX, startY} = startIndices
        
        // console.log('along', alongX, alongY, 'indices', startX, startY)
        const _coords =  Array.from({length: alongX * alongY}, (_, i) => ({
            x: startX + i % alongX,
            y: startY + Math.floor(i / alongX)
        }))

        if(state.dragging){
            _coords.push(state.dragging)
        }

        return _coords;
    }, [cellsAlongAxes, startIndices, state.dragging])

    const getCoordUnderClient = (): Vector2 => {
        const pos = Vector2.from(state.position1).sum(Vector2.from(state.client))
        return pos.divInt(new Vector2(
            props.cellSize.width + props.gap, 
            props.cellSize.height + props.gap))
    }

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
        const isMouseDown = true
        const startDrag = new Vector2(e.clientX, e.clientY)
        const client = Vector2.fromClient(e)
        const dragging = props.mode === 'edit' && state.overHandler !== null ? state.overHandler : null
        setState(st => ({
            ...st,
            isMouseDown,
            startDrag,
            dragging,
            client
        }))
    }

    const getItemPosition = (coord: Vector2): Vector2  => {
        const pos = new Vector2(
            coord.x * (props.cellSize.width + props.gap),
            coord.y * (props.cellSize.height + props.gap)
        )
        if(state.dragging && coord.equals(state.dragging)){
            const delta = state.client.sub(state.startDrag)
            return pos.sum(delta)
        }
        return pos
    }

    const handleMouseUp = (e: MouseEvent<HTMLDivElement>): void => {
        const isMouseDown = false
        const position1 = state.isPanning ? state.position2 : state.position1
        const isPanning = false
        const client = Vector2.fromClient(e)
        
        const overHandler = null
        let dragging = state.dragging
        if(dragging !== null){
            const currentCoord = getCoordUnderClient() // Coord.zero // temp
            props.swap(dragging, currentCoord)
            dragging = null
        }
        setState(st => ({
            ...st,
            isPanning,
            isMouseDown,
            position1,
            dragging,
            overHandler,
            client
        }))
    }

    const handleClickCapture = (e: MouseEvent<HTMLDivElement>): void => {
        if(state.isPanning){
            e.stopPropagation()
            setState(st => ({
                ...st,
                isPanning: false
            }))
        }
    }

    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>): void => {
        // const overCoord = getCoordUnderClient()
        const client = Vector2.fromClient(e)
        let upd: GridState;
        if(!state.isMouseDown) {
            // upd = {...state, client, overCoord}
            return
        }
        else if(state.dragging === null){
            const delta = Vector2.fromClient(e).sub(Vector2.from(state.startDrag))
            const isPanning = state.isPanning || (delta.mag() > 4)
            const position2 = isPanning ? state.position1.sum(delta) : state.position1
            upd = {...state, isPanning, position2, client } 
        }
        else {
            const draggingDelta = Vector2.fromClient(e).sub(Vector2.from(state.startDrag))
            upd = {...state, draggingDelta, client }
        }
        setState(upd)
    }, [
        setState, 
        state,
    ])

    const handleHandlerEnter = (coord: Vector2) => () => {
        if(props.mode === 'edit' && state.dragging === null){
            setState(st => ({
                ...st,
                overHandler: coord
            }))
        }
    }

    const handleHandlerLeave = () => () => {
        if(props.mode === 'edit' && state.dragging === null){
            setState(st => ({
                ...st,
                overHandler: null
            }))
        }
    }

    const handleCoordEnter = useCallback((coord: Vector2) => () => {
        setState(st => ({...st, overCoord: coord}))
    }, [setState])

    return {
        position: state.position2,
        isMouseDown: state.isMouseDown,
        viewRef,
        coords,
        overHandler: state.overHandler,
        overCoord: state.overCoord,
        getItemPosition,
        state,
        handlers: {
            handleMouseDown,
            handleMouseUp,
            handleMouseMove,
            handleClickCapture,

            handleCoordEnter,

            handleHandlerEnter,
            handleHandlerLeave,
        }
    }
}
