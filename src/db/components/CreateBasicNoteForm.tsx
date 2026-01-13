import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useCreateBasicNoteMutation } from "../../notes/note.api";

type Input = {
    front: string
    back: string
}

export const CreateBasicNoteForm: FC = () => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Input>()

    const [createNote, ] = useCreateBasicNoteMutation()

    const onSubmit = (data: Input): void => {
        createNote({
            front: data.front.trim(),
            back: data.back.trim()
        })
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                className="input"
                placeholder="front"
                {...register(
                    "front",
                    {required: true}
                )}
            />
            <input
                className="input"
                placeholder="back"
                {...register(
                    "back",
                    {required: true}
                )}
            />

            <button type="submit">Create</button>
        </form>
    )
}