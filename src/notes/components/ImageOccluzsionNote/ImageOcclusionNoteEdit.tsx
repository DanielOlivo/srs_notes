import { useEffect, useRef, useState, type FC } from "react";
import type { IVector2 } from "../../../utils/Vector2";
import { useNavigate } from "react-router";
import { noteApi, useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ImageOcclusion, type IImageOcclusionSerialized, type ImageOcclusionData } from "../../../db/entities/imageOcclusion";
import { Drawer } from "../../../common/components/Drawer/Drawer";
import type { IRect } from "../../../common/entities/Rect";
import { UpdateButton } from "../../../common/components/UpdateButton/UpdateButton";
import { useAppDispatch } from "../../../app/hooks";

export interface ImageOcclusionNoteEditProps {
    id?: string
    docId?: string
    coord: IVector2
}

export const ImageOcclusionNoteEdit: FC<ImageOcclusionNoteEditProps> = ({id, docId, coord}) => {

    const navigate = useNavigate()

    const noteRef = useRef<ImageOcclusion | null>(null)
    const blobRef = useRef<Blob | null>(null)
    const [url, setUrl] = useState('')
    const [rects, setRects] = useState<IRect[]>([])
    const [rects2, setRects2] = useState<IRect[]>([]) 

    const [create, ] = useCreateNoteMutation()

    const [isLoading, setIsLoading] = useState(true)

    const dispatch = useAppDispatch()

    const updateImage = (blob: Blob) => {
        blobRef.current = blob
        setUrl(URL.createObjectURL(blob))
    }

    const onSubmit = async () => {
        try{
            if(id){ // update
                const note = await ImageOcclusion.get(id)
                if(!note)
                    throw new Error(`ImageOcclusion.get failure: ${id}`)                
                note.rects = rects2 // rects
                if(blobRef.current)
                    note.blob = blobRef.current
                await note.update()
                dispatch(noteApi.util.invalidateTags([
                    { type: 'Note', id: note.id},
                ])) 
            } else if(blobRef.current && docId){
                await create({
                    docId,
                    coord,
                    data: {
                        kind: 'imageOcclusion',
                        blob: blobRef.current,
                        rects: rects2 
                    }
                })
            }

            navigate(-1)
        }
        catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        if(id !== undefined){
            ImageOcclusion.get(id).then(note => {
                noteRef.current = note
                if(note){
                    updateImage(note.blob)
                    setRects(note.rects)
                }
                setIsLoading(false)
            })
        }

        return () => URL.revokeObjectURL(url)
    }, [])

    const updateRects = (rects: IRect[]) => {
        if(isLoading) return
        setRects(rects)
    }

    return (
        <form>
            <Drawer
                src={url}
                rects={rects}
                onChange={setRects2}
            />
            <input
                type="file"
                onChange={(e) => {
                    if(e.target.files)
                        updateImage(e.target.files[0])
                }}
            />

            <UpdateButton
                onClick={onSubmit}
                title={id === undefined ? 'Create' : "Update"}
            />
        </form>
    )
}