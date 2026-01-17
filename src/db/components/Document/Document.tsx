import type { FC } from "react";
import { useGetDocumentQuery } from "../../../documents/document.api";

export interface DocumentProps {
    id: string
}

export const Document: FC<DocumentProps> = ({id}) => {

    const {data: doc, isLoading, isError } = useGetDocumentQuery(id) 

    if(isLoading){
        return <div>Loading...</div>
    }

    if(isError || !doc){
        return <div>Error occurred</div>
    }

    return (
        <div>
            {id}: {doc.name}
        </div>
    )
}