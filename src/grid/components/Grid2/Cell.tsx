import { useCallback, useContext, useMemo, type FC } from "react"
import { Vector2 } from "../../../utils/Coord"
import { GridContext } from "./gridContext"
import { CounterContext } from "../../../utils/useCounters"
import { Counter } from "./Counter"
import type { Mode } from "./Grid2"

type CellProps = {
    mode: Mode
    coord: Vector2
    cellSize: {
        width: number
        height: number
    }
    gap: number
}

export const Cell: FC<CellProps> = ({mode, coord, cellSize: {width, height}, gap}) => {

    const grid = useContext(GridContext)
    const counters = useContext(CounterContext)

    const id = counters.tryGetByCoord(coord) ?? null

    const placeStyle = useMemo((): React.CSSProperties => ({
        width: `${width}px`,
        height: `${height}px`,
        top: `${coord.y * (height + gap)}px`,
        left: `${coord.x * (width + gap)}px`,
        position: "absolute"
    }), [width, height, gap, coord])

    const getItemPosition = useCallback((coord: Vector2): Vector2  => {
        const { dragging, client, startDrag } = grid.state
        const pos = new Vector2(
            coord.x * (width + gap),
            coord.y * (height + gap)
        )
        if(dragging && coord.equals(dragging)){
            const delta = client.sub(startDrag)
            return pos.sum(delta)
        }
        return pos
    }, [grid.state, width, height, gap])

    return (
        <div
            style={placeStyle}
            onMouseEnter={grid.handlers.handleCoordEnter(coord)} 
        >
            <div
                className="rounded-sm overflow-hidden"
                style={{
                    width,
                    height,
                    top: getItemPosition(coord).y, // coord.y * (cellSize.height + gap),
                    left: getItemPosition(coord).x, // coord.x * (cellSize.width + gap),
                    border: coord.equals(Vector2.from(grid.overCoord)) ? "1px solid oklch(92.9% 0.013 255.508)" : "1px solid oklch(55.4% 0.046 257.417)"
                }}
            >
                {id ? (
                    <>
                        <Counter id={id} /> 
                        {mode === 'edit' && (
                            <div
                                className="absolute top-0 right-0 w-5 h-5"    
                                onMouseEnter={grid.handlers.handleHandlerEnter(coord)}
                                onMouseLeave={grid.handlers.handleHandlerLeave()}
                            />
                        )}
                    </>
                ) : <div>no content</div>}
            </div>
        </div>
    )
}