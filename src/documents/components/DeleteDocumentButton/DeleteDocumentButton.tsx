import { useEffect, useState, type FC } from "react";
import { useDeleteDocumentMutation } from "../../document.api";
import { useNavigate } from "react-router";
import { TrashIcon } from "@heroicons/react/24/outline";

export interface DeleteDocumentButtonProps {
    id: string
}

export const DeleteDocumentButton: FC<DeleteDocumentButtonProps> = ({id}) => {
    
    const [deleteDoc, ] = useDeleteDocumentMutation()
    const navigate = useNavigate()

    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => setDisabled(false), 4000)

        return () => clearTimeout(timeout)
    }, [])

    return <button
        className="btn btn-error"
        disabled={disabled}
        onClick={() => {
            deleteDoc(id)
            navigate("./doc")
        }}
    ><TrashIcon className="size-6 mr-2" />Delete</button>
}