import { useEffect, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import { useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";
import { isBasicNote, type BasicNoteData } from "../../../db/entities/Note";

export interface BasicNoteEditProps {
    id?: string
}

/** simple front and back */
export const BasicNoteEdit: FC<BasicNoteEditProps> = ({id}) => {

    const [getNote, { data: note }  ] = useLazyGetNoteQuery()
    const [createNote, {isLoading}] = useCreateNoteMutation();
    const [updateNote, ] = useUpdateNoteMutation()

    const {
        register,
        handleSubmit,
        reset,
        // formState: { errors },
    } = useForm<BasicNoteData>();


    const onSubmit: SubmitHandler<BasicNoteData> = (data) => {
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
            if(isBasicNote(note)){
                reset({
                    front: note.front,
                    back: note.back
                })
            }
        }
    }, [reset, note])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                {...register("front", { 
                    required: true,
                    minLength: 1
                })}
                disabled={id !== undefined ? isLoading : false}
                placeholder="front"
            />
            
            <input
                {...register("back", { 
                    required: true,
                    minLength: 1
                })}
                placeholder="back"
            />

            <button 
                type="submit"
                disabled={isLoading}
            >{id !== undefined ? "Update" : "Create"}</button>

        </form>
    )
}