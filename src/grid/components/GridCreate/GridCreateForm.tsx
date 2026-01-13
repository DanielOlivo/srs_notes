import type { FC } from "react";
import { useForm } from "react-hook-form";
import { CreateGridRequestDto } from "../../grid.dto";
import { useCreateGridMutation } from "../../grid.api";

type Request = {
    name: string
}

export const GridCreateForm: FC = () => {

    const [createGrid, ] = useCreateGridMutation();

    const {
        register,
        handleSubmit
    } = useForm<Request>()

    const onSubmit = async ({ name }: Request) => {
        await createGrid(new CreateGridRequestDto(name))
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)} 
            className="flex flex-col justify-start items-center"
        >
            <input
                type="text"
                placeholder="grid name..."
                {...register(
                    "name",
                    {
                        required: true,
                        maxLength: 20,
                        minLength: 1
                    }
                )}
            />

            <button 
                type="submit"
                className="btn mt-2"
            >Create</button>
        </form>
    )
}