import type { FC } from "react";
import type { ITextNote as TextNoteRecord } from "../../../db/entities/Note";

export const TextNote: FC<TextNoteRecord> = ({id, text}) => {

    return (
        <div className="w-full h-full flex justify-center items-center">
            <span>{text}</span>
        </div>
    )
}