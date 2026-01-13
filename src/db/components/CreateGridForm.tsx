import type { FC } from "react";
import { CreateGridRequestDto } from "../../grid/grid.dto";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateGridMutation } from "../../grid/grid.api";

type Input = {
    name: string
}

export const CreateGridForm: FC = () => {

    const [createGrid, ] = useCreateGridMutation() 

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Input>()

    const onSubmit: SubmitHandler<Input> = (data) => {
        createGrid({
            name: data.name.trim()
        })
        reset()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                className="input"
                {...register(
                    "name",
                    {
                        required: true,
                    }
                )}
            />

            <button type="submit">Create</button>
        </form>
    )
}