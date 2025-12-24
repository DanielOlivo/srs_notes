import { useCallback, useEffect, type FC } from "react";
import type { Coord } from "../../../utils/Coord";
import { useGrid } from "./useGrid";
import type { Mode } from "fs";
import { useCounters } from "../../../utils/useCounters";



const cellSize = {
    width: 200,
    height: 100
}
const gap = 5

export type Grid2Props = {
    mode: Mode,
    cellSize: {
        width: number,
        height: number
    },
    gap: number
}

export const Grid2: FC<Grid2Props> = (props) => {

    const {counters, decrement, increment, tryGetByCoord, seed} = useCounters()
    const {
        position, 
        viewRef, 
        coords, 
        handlers
    } = useGrid(props)

    useEffect(() => {
        if(seed)
            seed()
    }, [seed])

    const counter = useCallback((id: string) => {
        const value = counters[id]
        return (
            <div className="w-full h-full grid grid-cols-2 gap-2 text-slate-500">
                <div className="col-span-2 flex justify-center items-center">
                    <p>{value}</p> 
                </div>
                <button onClick={() => decrement(id)}>-</button>
                <button onClick={() => increment(id)}>+</button>
            </div>
        )
    }, [counters, increment, decrement])

    const cell = (coord: Coord) => {

        const id = tryGetByCoord(coord)

        return (
            <div
                key={`${coord.x} ${coord.y}`}
                className="absolute border border-slate-400 rounded-sm overflow-hidden"
                style={{
                    width: cellSize.width,
                    height: cellSize.height,
                    top: coord.y * (cellSize.height + gap),
                    left: coord.x * (cellSize.width + gap),
                }}
            >
                {id ? (
                    <>
                        counter(id) 
                        {props.mode === 'edit' && (
                            <div 
                                onMouseEnter={handlers.handleHandlerEnter(coord)}
                                onMouseLeave={handlers.handleHandlerLeave(coord)}
                                className="absolute top-0 right-0 w-5 h-5 bg-green-500" 
                            />
                        )} 
                    </>
                ) : <div className="text-slate-500">no content</div>}
            </div>
        )
    }

    return (
        <div 
            className="w-full h-full overflow-hidden select-none" 
            ref={viewRef}
            onMouseDown={handlers.handleMouseDown} 
            onMouseUp={handlers.handleMouseUp}
            onMouseMove={handlers.handleMouseMove}
        >
            <div
                className="relative w-2 h-2 bg-red-500"
                style={{
                    top: position.y,
                    left: position.x,
                }}
            >
                {coords.map(coord => cell(coord))}
            </div>
        </div>
    )
}