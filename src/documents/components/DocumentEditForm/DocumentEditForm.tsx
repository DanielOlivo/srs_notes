import { useEffect, type FC } from "react";
import { useCreateMutation, useLazyGetDocumentQuery } from "../../document.api";
import { type CreateDocumentRequestDto } from "../../document.dto";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams } from "react-router";

// export interface DocumentEditFormProps {
//     id?: string
// }

export const DocumentEditForm: FC = () => {

    const { docId: id } = useParams<{docId: string}>()
    const [getDoc, { data: doc}] = useLazyGetDocumentQuery()
    const [createDoc, ] = useCreateMutation()


    const {
        register,
        handleSubmit,
        reset
    } = useForm<CreateDocumentRequestDto>();

    useEffect(() => {
        if(id !== undefined){
            getDoc(id).then((result) => {
                if(result.data){
                    reset({
                        name: result.data.name,
                        type: result.data.type
                    })
                }
            })
        }
    }, [id]) 

    const onSubmit: SubmitHandler<CreateDocumentRequestDto> = (data) => {
        if(id === undefined){
            createDoc(data)
        }
        throw new Error()
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1"
        >
            <div>
                <label className="select">
                    <span className="label">Type</span> 
                    <select
                        {...register("type", { required: true})} 
                    >
                        <option>List</option>
                        <option disabled={true}>Grid</option>
                    </select>
                </label> 
            </div>

            <div>
                <label className="input">
                    <span className="label">Name</span>
                    <input
                        {...register("name", { required: true, minLength: 1})}
                        type="text"
                    />
                </label>
            </div>

            <div>
                <button type="submit">{id !== undefined ? "Update" : "Create"}</button>
            </div>
        </form>
    )
}