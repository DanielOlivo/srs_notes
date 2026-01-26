import { useRef, useState, type FC } from "react";
import type { DocumentInfoDto } from "../document.dto";
import { useDeleteDocumentMutation, useGetDocumentQuery, useRenameDocumentMutation } from "../document.api";

export interface DocumentItemProps {
    id: string
}

export const DocumentItem: FC<DocumentItemProps> = ({id}) => {

    const { data: document, isLoading, isError, error } = useGetDocumentQuery(id)

    const [onEdit, setOnEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [rename] = useRenameDocumentMutation(); 
    const [deleteDocument] = useDeleteDocumentMutation();

    const handleSave = () => {
        if(inputRef.current && document){
            rename({id: document.id, newName: inputRef.current.value})
        }
    }

    const handleCancel = () => {
        setOnEdit(false);
        if(inputRef.current && document)
            inputRef.current.value = document.name;
    }

    const handleDelete = () => {
        if(document)
            deleteDocument(document.id);
    }

    if(isLoading){
        return <li>Loading...</li>
    }

    if(isError || !document){
        return <li>Error {errorToString(error)}</li>
    }

    return (
        <li>
            {document && <span>{document.id}</span>}

            <input
                ref={inputRef}
                defaultValue={document.name}
                disabled={!onEdit}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
            {/* <span>{uploadedAt.toString()}</span> */}
            {/* <span>{size}</span> */}
            <button onClick={handleDelete}>Delete</button>
        </li>
    )
}

function errorToString(err: unknown): string {
    if(typeof err === 'string')
        return err as string
    if(typeof err === 'object')
        return JSON.stringify(err)
    return `unknown error ${err}`
}