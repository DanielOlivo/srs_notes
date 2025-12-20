import type { FC } from "react";
import { useGetDocumentListQuery } from "../document.api";
import { DocumentItem } from "./DocumentItem";

export const DocumentList: FC = () => {

    const {data, isError, isLoading} = useGetDocumentListQuery();

    if(isLoading){
        return <div>Loading document list...</div>
    }

    if(isError){
        return (
            <div>Error occurred</div>
        )
    }

    if(!data || !data.documents || data.documents.length === 0){
        return <div>No documents</div>
    }

    return (
        <ul>
            {data.documents.map(doc => <DocumentItem {...doc} />)}
        </ul>
    );
}