import { useEffect, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import { useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";
import { isBasicNote, type BasicNoteData } from "../../../db/entities/Note";
import { useNavigate } from "react-router";
import type { IVector2 } from "../../../utils/Vector2";

export interface BasicNoteEditProps {
    id?: string
    docId?: string
    coord: IVector2
}

/** simple front and back */
export const BasicNoteEdit: FC<BasicNoteEditProps> = ({id, docId, coord}) => {

    const navigate = useNavigate()
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
            if(note && note.kind === 'basic'){
                const {..._note} = note
                _note.front = data.front
                _note.back = data.back
                updateNote( _note )
            }
        }
        else {
            if(!docId) throw new Error("failed to get docId from url")
            createNote( { data, docId, coord } );
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