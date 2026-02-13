import { useEffect, type FC } from "react";
import { useCreateMutation, useLazyGetDocumentQuery } from "../../document.api";
import { type CreateDocumentRequestDto } from "../../document.dto";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useParams } from "react-router";
import { DeleteDocumentButton } from "../DeleteDocumentButton/DeleteDocumentButton";

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
            getDoc(id)//.then((result) => {
        }
    }, [id, getDoc]) 

    useEffect(() => {
        if(doc){
            reset({
                name: doc.name,
                type: doc.type
            })
        }
    }, [doc, reset])

    const onSubmit: SubmitHandler<CreateDocumentRequestDto> = (data) => {
        if(id === undefined){
            createDoc(data)
        }
        throw new Error()
    }

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-2"
        >
            <div>
                <label className="select">
                    <span className="label">Type</span> 
                    <select
                        {...register("type", { required: true})} 
                        disabled={id !== undefined}
                    >
                        <option value="list">List</option>
                        <option value="grid" disabled={true}>Grid</option>
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
                <button 
                    type="submit"
                    className="btn btn-primary"
                >{id !== undefined ? "Update" : "Create"}</button>
            </div>

            <div>
                {id && <DeleteDocumentButton id={id} />}
            </div>
        </form>
    )
}