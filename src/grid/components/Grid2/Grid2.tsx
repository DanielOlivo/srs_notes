import { useCallback, useEffect, type FC  } from "react";
import { Vector2 } from "../../../utils/Coord";
import { useGrid  } from "./useGrid";
import { CounterContext, useCounters } from "../../../utils/useCounters";
import { StateDisplay } from "./StateDisplay";
import { GridContext } from "./gridContext";
import { Place } from "./Place";
import { Cell } from "./Cell";

export type Mode = 'normal' | 'edit'


export type Grid2Props = {
    mode: Mode,
    cellSize: {
        width: number,
        height: number
    },
    gap: number,
    swap: (coord1: Vector2, coord2: Vector2) => void
    selectCoord: (coord: Vector2) => void
}



export const Grid2: FC<Grid2Props> = (props) => {

    const countersState = useCounters()
    // const {counters, decrement, increment, tryGetByCoord, seed, swap} = useCounters()
    const {counters, decrement, increment, tryGetByCoord, seed, swap} = countersState

    const gridHook = useGrid({...props, swap})
    const {
        position, 
        viewRef, 
        coords, 
        handlers,
        overHandler,
        overCoord,
        getItemPosition,
        handleItemEnter,
        state
    } = gridHook
    // } = useGrid({...props, swap})

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

    const cell = (coord: Vector2) => {

        const id = tryGetByCoord(coord)

        return (
            <div
                key={`${coord.x} ${coord.y}`}
                className="absolute rounded-sm overflow-hidden"
                style={{
                    width: props.cellSize.width,
                    height: props.cellSize.height,
                    top: getItemPosition(coord).y, // coord.y * (cellSize.height + gap),
                    left: getItemPosition(coord).x, // coord.x * (cellSize.width + gap),
                    border: coord.equals(Vector2.from(overCoord)) ? "1px solid oklch(92.9% 0.013 255.508)" : "1px solid oklch(55.4% 0.046 257.417)"
                }}
                // onMouseEnter={handlers.handleItemEnter(coord)}
            >
                {id ? (
                    <>
                        {counter(id)}
                        {props.mode === 'edit' && (
                            <div 
                                onMouseEnter={handlers.handleHandlerEnter(coord)}
                                onMouseLeave={handlers.handleHandlerLeave()}

                                // the class is not preserved
                                className={`absolute top-0 right-0 w-5 h-5 ${overHandler && overHandler.equals(coord) ? "bg-green-500" : "bg-orange-500"}`}
                            />
                        )} 
                    </>
                ) : <div className="text-slate-500">no content</div>}
            </div>
        )
    }


    return (
        <GridContext.Provider value={gridHook}>
            <CounterContext.Provider value={countersState}>
                <div 
                    className="w-full h-full overflow-hidden select-none" 
                    ref={viewRef}
                    onMouseDown={handlers.handleMouseDown} 
                    onMouseUp={handlers.handleMouseUp}
                    onMouseMove={handlers.handleMouseMove}
                    onClickCapture={handlers.handleClickCapture}
                >
                    <div
                        className="relative w-2 h-2 bg-red-500"
                        style={{
                            top: position.y,
                            left: position.x,
                        }}
                    >
                        {/* {coords.map(coord => (
                            <Place 
                                key={`${coord.x} ${coord.y}`} 
                                gap={props.gap}
                                coord={new Coord(coord.x, coord.y)} 
                                cellSize={props.cellSize}
                                setOverCoord={handlers.handleCoordEnter(new Coord(coord.x, coord.y))}
                            />
                        ))} */}

                        {/* {coords.map(coord => cell(Coord.from(coord)))} */}
                        {coords.map(coord => (
                            <Cell
                                mode={props.mode}
                                coord={Vector2.from(coord)}
                            />
                        ))}
                    </div>
                    <StateDisplay {...state} />
                </div>
            </CounterContext.Provider>
        </GridContext.Provider>
    )
}