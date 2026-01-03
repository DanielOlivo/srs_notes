import { createContext, useCallback, useMemo, useState } from "react"
import { Vector2, type IVector2 } from "../../../utils/Coord"

export const useSimpleGrid = (size: IVector2) => {

    const [position, setPosition] = useState<IVector2>({ x: 0, y: 0 })
    const move = useCallback((delta: IVector2) => {
        setPosition(pos => Vector2.add(pos, delta))
    }, [])
    
    const coords = useMemo((): IVector2[] => {
        return Array.from({length: size.x * size.y}, (_, i) => new Vector2(
            position.x + i % size.x,
            position.y + Math.floor(i / size.x)
        ))
    }, [size, position])

    return {
        position,
        move,
        coords
    }
}

type SimpleGridHook = ReturnType<typeof useSimpleGrid>

export const SimpleGridContext = createContext<SimpleGridHook>({
    position: {x: 0, y: 0},
    move: () => {},
    coords: []
})