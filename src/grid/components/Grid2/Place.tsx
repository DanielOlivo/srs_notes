import { useCallback, useMemo, type FC } from "react";
import type { Vector2 } from "../../../utils/Coord";

export interface PlaceProps {
    coord: Vector2
    cellSize: {
        width: number,
        height: number
    }
    gap: number
    setOverCoord: (coord: Vector2) => void
}

export const Place: FC<PlaceProps> = ({coord, setOverCoord, cellSize: {width, height}, gap}) => {

    const handleMouseEnter = useCallback(() => {
        setOverCoord(coord)
    }, [coord, setOverCoord])

    const style = useMemo((): React.CSSProperties => ({
        width: `${width}px`,
        height: `${height}px`,
        top: `${coord.y * (height + gap)}px`,
        left: `${coord.x * (width + gap)}px`,
        position: "absolute",
    }), [width, height, gap, coord])

    return (
        <div
            style={style} 
            onMouseEnter={handleMouseEnter}
        />
    )
}