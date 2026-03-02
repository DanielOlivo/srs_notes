import { useState, type FC } from "react";

export interface CounterProps {
    initCount: number
}

export const Counter: FC<CounterProps> = ({initCount}) => {

    const [count, setCount] = useState(initCount)

    const inc = () => setCount(count + 1)
    const dec = () => setCount(count - 1)

    return (
        <div className="w-full h-full grid grid-cols-2 border-2 border-slate-400 rounded-2xl">
            <div className="flex justify-center items-center col-span-2">
                <span className="text-center text-slate-500 text-5xl">{count}</span>
            </div>
            <div className="flex justify-center items-center">
                <button className="btn btn-primary" onClick={dec}>-</button>
            </div>
            <div className="flex justify-center items-center">
                <button className="btn btn-primary" onClick={inc}>+</button>
            </div>
        </div>
    )
}