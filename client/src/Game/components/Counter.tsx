import { useState, type FC } from "react";

export const Counter: FC = () => {

    const [count, setCount] = useState(0);

    const handleInc = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCount(count + 1);
    }

    const handleDec = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCount(count - 1);
    }

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <span>Count: {count}</span>
            <div className="w-full flex flex-row justify-between items-center">
                <button onClick={handleDec}>-</button>
                <button onClick={handleInc}>+</button>
            </div>
        </div>
    )
}