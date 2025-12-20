import { useRef, useState, type FC } from "react";
import type { DocumentInfoDto } from "../document.dto";
import { useDeleteDocumentMutation, useRenameDocumentMutation } from "../document.api";

export const DocumentItem: FC<DocumentInfoDto> = ({hash, name, uploadedAt, size}) => {

    const [onEdit, setOnEdit] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [rename] = useRenameDocumentMutation(); 
    const [deleteDocument] = useDeleteDocumentMutation();

    const handleSave = () => {
        if(inputRef.current){
            rename({id: hash, newName: inputRef.current.value})
        }
    }

    const handleCancel = () => {
        setOnEdit(false);
        if(inputRef.current)
            inputRef.current.value = name;
    }

    const handleDelete = () => deleteDocument(hash);

    return (
        <li>
            <span>{hash}</span>

            <input
                ref={inputRef}
                defaultValue={name}
                disabled={!onEdit}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
            <span>{uploadedAt.toString()}</span>
            <span>{size}</span>
            <button onClick={handleDelete}>Delete</button>
        </li>
    )
}