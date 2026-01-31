import { useEffect, type FC } from "react";
import { isTextNote, type TextNoteData } from "../../../db/entities/Note";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";

export interface TextNoteEditProps {
    id?: string
}

export const TextNoteEdit: FC<TextNoteEditProps> = ({id}) => {

    const [getNote, { data: note }  ] = useLazyGetNoteQuery()
    const [createNote, {isLoading}] = useCreateNoteMutation();
    const [updateNote, ] = useUpdateNoteMutation()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<TextNoteData>();

    const onSubmit: SubmitHandler<TextNoteData> = (data) => {
        if(id !== undefined){
            updateNote( { id, data } )
        }
        else {
            createNote( data );
        }
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