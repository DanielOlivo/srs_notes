import { useEffect, type FC } from "react";
import { isTextNote, type TextNoteData } from "../../../db/entities/Note";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";
import { useNavigate, useParams } from "react-router";
import type { IVector2 } from "../../../utils/Vector2";

export interface TextNoteEditProps {
    id?: string
    docId?: string
    coord: IVector2
}

export const TextNoteEdit: FC<TextNoteEditProps> = ({id, docId, coord}) => {

    const navigate = useNavigate()
    const [getNote, { data: note }  ] = useLazyGetNoteQuery()
    const [createNote, {isLoading}] = useCreateNoteMutation();
    const [updateNote, ] = useUpdateNoteMutation()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<TextNoteData>();

    const onSubmit: SubmitHandler<TextNoteData> = (data) => {
        if(!docId) throw new Error("failed to get docId from url")
        if(id !== undefined){
            updateNote( { id, data } )
        }
        else {
            if(!docId) throw new Error("failed to get docId from url")
            createNote( { data: {text: data.text, kind: 'text'}, docId, coord } );
        }
        navigate(-1)
    }

    useEffect(() => {
        if(id !== undefined){
            getNote(id)
        }
    }, [getNote, id])

    useEffect(() => {
        if(note !== undefined){
            if(isTextNote(note)){
                reset({
                    text: note.text
                })
            }
        }
    }, [reset, note])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                type='text'
                {...register("text", {
                    required: true,
                    minLength: 1
                })}
            />

            <button 
                type="submit"
                disabled={isLoading}
            >{id !== undefined ? "Update" : "Create"}</button>

       </form> 
    )
}