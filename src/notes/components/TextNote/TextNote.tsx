import type { FC } from "react";

export interface TextNoteProps {
    id: string
    text: string
}

export const TextNote: FC<TextNoteProps> = ({id, text}) => {

    return (
        <div className="w-full h-full flex justify-center items-center">
            <span>{text}</span>
        </div>
    )
}