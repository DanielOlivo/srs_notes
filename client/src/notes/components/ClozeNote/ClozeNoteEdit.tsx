import { useEffect, type FC } from "react";
import { useNavigate } from "react-router";
import { useCreateNoteMutation, useLazyGetNoteQuery, useUpdateNoteMutation } from "../../note.api";
import type { ClozeNoteData } from "../../../db/entities/cloze";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { IVector2 } from "../../../utils/Vector2";

export interface ClozeNoteEditProps {
    id?: string
    docId?: string
    coord: IVector2
}

export const ClozeNoteEdit: FC<ClozeNoteEditProps> = ({id, docId, coord}) => {

    const navigate = useNavigate()
    const [ getNote, { data: note, isLoading: isFetching }] = useLazyGetNoteQuery()
    const [createNote, {isLoading: isCreating }] = useCreateNoteMutation()
    const [updateNote, {isLoading: isUpdating }] = useUpdateNoteMutation()
    
    const {
        register,
        handleSubmit,
        reset,
        // formState: { errors },
    } = useForm<ClozeNoteData>();

    const onSubmit: SubmitHandler<ClozeNoteData> = (data) => {
        if(id !== undefined){
            if(note && note.kind === 'cloze'){
                const {..._note} = note
                _note.text = data.text
                updateNote( _note )
            }
        }
        else {
            if(!docId) throw new Error("failed to get docId from url")
            createNote( { data: {...data, kind: 'cloze'}, docId, coord } );
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
            if(note.kind === 'cloze'){
                reset({
                    text: note.text
                })
            }
        }
    }, [reset, note])

    return (

        <form onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-start items-center" 
        >
            <input
                {...register('text', {
                    required: true
                })}
                placeholder="cloze text"
            />

            <button 
                type="submit"
                disabled={isFetching || isCreating || isUpdating}
                className="btn btn-accent"
            >{id !== undefined ? "Update" : "Create"}</button>
        </form>
    )
}