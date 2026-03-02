import type { FC } from "react";

export interface ItemData {
    id: string
    front: string
    back: string
    showBack: boolean
}

export const Item: FC<ItemData> = ({id, front, back, showBack}) => {

    const showAnswer = () => {
        throw new Error('not implemented');
    }

    const handleClick = () => {
        if(!showBack) 
            showAnswer();
    }

    return (
        <div>
            <div 
                className="w-full h-full flex justify-center items-center"
                onClick={handleClick}                 
            >
                <span>{showBack ? back : front}</span>
            </div>
        </div>
    )
};