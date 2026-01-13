import { useContext, type FC } from "react"
import { CounterContext } from "../../../utils/useCounters"

interface CounterProps {
    id: string
}

export const Counter: FC<CounterProps> = ({id}) => {

    const { counters, increment, decrement } = useContext(CounterContext)
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
}