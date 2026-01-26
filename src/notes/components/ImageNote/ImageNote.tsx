import { useEffect, useMemo, type FC } from "react";
import type { IImageNote as ImageNoteRecord } from "../../../db/entities/Note";

export const ImageNote: FC<ImageNoteRecord> = ({id, data}) => {
    const src = useMemo(() => URL.createObjectURL(data), [data]);

    useEffect(() => {
        return () => URL.revokeObjectURL(src)
    }, [src])

    return (
        <div className="w-full h-full flex justify-center items-center">
            <img src={src} alt={id} className="object-contain"/>
        </div>
    )
}