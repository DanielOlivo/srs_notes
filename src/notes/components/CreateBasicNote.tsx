import type { FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form"
import { type CreatebasicNoteDto } from "../notes.dto";
import { useCreateBasicNoteMutation } from "../note.api";


/** simple front and back */
export const CreateBasicNote: FC = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreatebasicNoteDto>();

    const [createNote, {isLoading}] = useCreateBasicNoteMutation();

    const onSubmit: SubmitHandler<CreatebasicNoteDto> = (data) => {
        createNote(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <input
                {...register("front", { 
                    required: true,
                    minLength: 1
                })}
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
            >Add</button>

        </form>
    )
}