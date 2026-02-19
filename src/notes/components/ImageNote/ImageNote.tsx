import { useEffect, useState, type FC } from "react";
import type { IImageNote } from "../../../db/entities/ImageNote";
import { withTx } from "../../../db/LocalDb";
import { ImageNote } from "../../../db/entities/Note.utils";

export const ImageNoteComponent: FC<Omit<IImageNote, "data">> = ({id}) => {

    const [url, setUrl] = useState<string | null>(null)

    useEffect(() => {
        withTx(ImageNote.getTx(id)).then(([image]) => {
            if(image && image.data){
                const url = URL.createObjectURL(image.data)
                setUrl(url)
            }
        })
    }, [id]);

    return (
        <div className="w-full flex justify-center items-center max-h-[300px] overflow-hidden">
            {url && <img src={url} alt={id} className="max-w-full object-contain"/>}
        </div>
    )
}