import type { FC } from "react";
import { useDeleteAllDocumentsMutation } from "../../documents/document.api";

export const CleanAllButton: FC = () => {

    const [ deleteAll, ] = useDeleteAllDocumentsMutation()

    return (
        <button
            className="btn btn-warning"
            onClick={() => deleteAll()} 
        >Clean All</button>
    )
}