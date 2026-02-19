import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import type { IVector2 } from "../../../utils/Vector2";
import { useNavigate, useParams } from "react-router";
import { useCreateNoteMutation, useUpdateNoteMutation } from "../../note.api";
import { ImageNote } from "../../../db/entities/Note.utils";

export interface ImageNoteEditProps {
    id?: string
    docId: string
    coord?: IVector2
}

export const ImageNoteEdit: FC<ImageNoteEditProps> = ({id, docId, coord}) => {

    const navigate = useNavigate()
    // const { docId } = useParams<{docId: string}>()
    const noteRef = useRef<ImageNote | null>(null)
    const blobRef = useRef<Blob | null>(null)
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    const [createNote, ] = useCreateNoteMutation()
    const [updateNote, ] = useUpdateNoteMutation()

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if(!file) return
        blobRef.current = file
        const url = URL.createObjectURL(file)
        setBlobUrl(url)
    }

    const handleSubmit = async () => {
        if(!blobRef.current) return
        if(noteRef.current?.kind === 'image'){
            const note = noteRef.current
            note.data = blobRef.current
            note.name = ""
            updateNote(note)
        }
        else {
            await createNote({
                docId,
                data: {data: blobRef.current, name: "", kind: 'image'},
                coord
            })
        }
        navigate(`/docs/${docId}`)
    }

    useEffect(() => {
        if(id){
            ImageNote.get(id).then(note => {
                if(!note) return
                noteRef.current = note
                const url = URL.createObjectURL(note.data)
                setBlobUrl(url)
            })
        }
    }, [id])

    return (
        <form
            className="flex flex-col justify-center items-center" 
        >
            <div>
                {blobUrl && (
                    <img
                        src={blobUrl}
                        className="object-contain"
                    />
                )}
            </div>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">Image</legend>
                <input
                    type='file'
                    className="file-input file-input-xl"
                    onChange={handleFileChange}
                />
                <p>Upload PNG, JPG, GIF or SVG</p>
            </fieldset>

            <button
                className="btn btn-primary" 
                onClick={handleSubmit}
                type="button"
            >{id ? "Update" : "Create"}</button>
        </form>
    )
}