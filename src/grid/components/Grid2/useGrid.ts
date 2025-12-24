import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Coord } from "../../../utils/Coord"
import type { Grid2Props } from "./Grid2"
import { type MouseEvent } from "react"
import { NotImplemented } from "../../../utils/NotImplemented"

type Mode = 'normal' | 'edit'

interface GridState {
    mode: Mode

    viewSize: {
        width: number
        height: number
    }

    position: Coord

    isMouseDown: boolean
    isPanning: boolean
    startDrag: Coord
    client: Coord

    overHandler: Coord | null
}

const initState: GridState = {
    mode: 'normal',

    viewSize: { width: 0, height: 0 },
    position: { x: 0, y: 0 },

    isMouseDown: false,
    isPanning: false,
    startDrag: { x: 0, y: 0 },
    client: { x: 0, y: 0 },
    
    overHandler: null
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
        const startX = -Math.floor(state.position.x / (props.cellSize.width + props.gap)) - 2
        const startY = -Math.floor(state.position.y / (props.cellSize.height + props.gap)) - 2
        return {startX, startY}
    }, [state.position, props])

    const coords = useMemo(() => {
        const {alongX, alongY} = cellsAlongAxes
        const {startX, startY} = startIndices
        
        console.log('along', alongX, alongY, 'indices', startX, startY)
        return Array.from({length: alongX * alongY}, (_, i) => ({
            x: startX + i % alongX,
            y: startY + Math.floor(i / alongX)
        }))
    }, [cellsAlongAxes, startIndices])

    const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>): void => {
        switch(state.mode){
            case "normal": {
                setState(st => ({
                    ...st,
                    isMouseDown: true,
                    startDrag: {x: e.clientX, y: e.clientY},
                    // client: { x: e.clientX, y: e.clientY }
                }))
                break;
            }
            case "edit": {
                throw new NotImplemented()
                break;
            }
        }
    }, [setState, state.mode])

    const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>): void => {
        switch(state.mode){
            case "normal": {
                setState(st => ({
                    ...st,
                    isMouseDown: false,
                    isPanning: false
                }))
                break;
            }
            case "edit": {
                throw new NotImplemented()
                break;
            }
        }
    }, [setState, state.mode])

    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>): void => {
        if(!state.isMouseDown) return

        switch(state.mode){
            case "normal": {
                const dx = e.clientX - state.startDrag.x
                const dy = e.clientY - state.startDrag.y
                
                const isPanning = state.isPanning || Math.abs(dx) > 4 || Math.abs(dy) > 4

                if (isPanning) {
                    setState(st => ({
                        ...st,
                        isPanning,
                        position: isPanning ? {
                            x: st.position.x + dx,
                            y: st.position.y + dy
                        } : st.position,
                        startDrag: { x: e.clientX, y: e.clientY }
                    }))
                }

                break;
            }
            case "edit": {
                throw new NotImplemented()
                break;
            }
        }
    }, [
        setState, 
        state.mode, 
        state.isMouseDown, 
        state.startDrag,
        state.isPanning
    ])

    // need argument
    const handleHandlerEnter = (coord: Coord) => () => {
        setState(st => ({
            ...st,
            overHandler: coord
        }))
    }

    const handleHandlerLeave = (coord: Coord) => () => {
        setState(st => ({
            ...st,
            overHandler: null
        }))
    }

    return {
        position: state.position,
        viewRef,
        coords,
        handlers: {
            handleMouseDown,
            handleMouseUp,
            handleMouseMove,

            handleHandlerEnter,
            handleHandlerLeave
        }
    }
}