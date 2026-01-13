import { createContext, useCallback, useState } from "react";
import { Vector2 } from "./Coord";
import { NotImplemented } from "./NotImplemented";

type CountersState = {[K: string]: number}
type PositionsState = {[K: number]: string}

export const useCounters = (initState?: CountersState, positionState?: PositionsState) => {

    const [counters, setCounters] = useState<CountersState>(initState ?? {})
    const [positions, setPositions] = useState<PositionsState>(positionState ?? {})

    const increment = useCallback((id: string) => {
        setCounters(st => {
            if (id in st) return { ...st, [id]: st[id] + 1 }
            return st
        })
    }, [setCounters])  

    const decrement = useCallback((id: string) => {
        setCounters(st => {
            if (id in st) return { ...st, [id]: st[id] - 1 }
            return st
        })
    }, [setCounters])  

    const add = useCallback((id: string, initValue: number, position: Vector2) => {
        setCounters(st => ({...st, [id]: initValue}))
        setPositions(st => ({...st, [hashCoord(position)]: id}))
    }, [setCounters, setPositions])

    const remove = useCallback((id: string) => {
        setCounters(st => {
            const {id: _, ...rest} = st
            return rest
        })
        setPositions(st => Object.fromEntries(
                Object.entries(st).filter(([, _id]) => _id !== id)
            )
        )
        
    }, [setCounters, setPositions])

    const tryGetByCoord = useCallback((coord: Vector2) => {
        const hash = hashCoord(coord)
        if(hash in positions)
            return positions[hash]
        return null
    }, [positions])

    const swap = useCallback((coord1: Vector2, coord2: Vector2) => {
        const hash1 = hashCoord(coord1)
        const hash2 = hashCoord(coord2)
        setPositions(st => {
            const id1 = hash1 in st ? st[hash1] : null
            const id2 = hash2 in st ? st[hash2] : null
            if(!id1 && !id2){
                return st
            }
            const updSt = {...st}
            if(id1 && id2){
                updSt[hash1] = id2
                updSt[hash2] = id1
                return updSt
            }
            if(id1 && !id2){
                updSt[hash2] = id1
                delete updSt[hash1]
                return updSt
            }
            if(!id1 && id2){
                updSt[hash1] = id2
                delete updSt[hash2]
                return updSt
            }
            throw new NotImplemented()
        })
    }, [setPositions])

    const seed = useCallback(() => {
        add("counter0", 1, new Vector2(0, 0))
        add("counter1", 1, new Vector2(0, 1))
        add("counter2", 1, new Vector2(1, 0))
    }, [add])

    return {
        counters,
        positions,
        increment,
        decrement,
        add,
        remove,
        swap,
        tryGetByCoord,
        seed
    }
}

export type Counters = ReturnType<typeof useCounters>

export const CounterContext = createContext<Counters>({
    counters: {},
    positions: {},
    increment: () => {},
    decrement: () => {},
    add: () => {},
    remove: () => {},
    swap: () => {},
    tryGetByCoord: () => null,
    seed: () => {}
})

function toUnit16(n: number): number {
    return (n + 0x8000) & 0xffff;
}

function fromUnit16(n: number): number {
    return (n & 0xffff) - 0x8000
}

function hashCoord(coord: Vector2){
    return (toUnit16(coord.x) << 16) | toUnit16(coord.y)
}

function unpackCoord(hash: number): Vector2 {
    return new Vector2(
        fromUnit16(hash >>> 16),
        fromUnit16(hash)
    )
}