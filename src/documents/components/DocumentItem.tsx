import { useRef, useState, type FC } from "react";
import { Link } from "react-router";
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
        return <li className="list-row">Loading...</li>
    }

    if(isError || !document){
        return <li className="list-row">Error {errorToString(error)}</li>
    }

    return (
        <li className="list-row">
            <div className="max-w-16">
                <p className="truncate">{document.id}</p>
            </div>

            <div>
                {/* <input
                    ref={inputRef}
                    defaultValue={document.name}
                    disabled={!onEdit}
                /> */}
                <p>
                    <Link to={`/doc/${document.id}`}>{document.name}</Link>
                </p>
            </div>

            <div>
                <button 
                    className="btn" 
                    onClick={handleSave}
                >Save</button>
            </div>

            <div>
                <button 
                    className="btn" 
                    onClick={handleCancel}
                >Cancel</button>
            </div>

            <div>
                <button 
                    className="btn btn-warning"
                    onClick={handleDelete}
                >Delete</button>
            </div>
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