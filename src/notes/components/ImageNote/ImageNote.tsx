import type { FC } from "react";

export interface ImageNoteProps {
    id: string
    src: string
}

export const ImageNote: FC<ImageNoteProps> = ({id, src}) => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <img src={src} alt={id} className="object-contain"/>
        </div>
    )
}