import type { FC } from "react";
import { useGetDocumentListQuery } from "../../document.api";
import { DocumentItem } from "../DocumentItem";

export const DocumentList: FC = () => {

    const {data: ids, isError, isLoading} = useGetDocumentListQuery();

    if(isLoading){
        return <div>Loading document list...</div>
    }

    if(isError || ids === undefined){
        return (
            <div>Error occurred</div>
        )
    }

    if(ids.length === 0){
        return <div>No documents</div>
    }

    return (
        <div className="w-full h-64 overflow-y-auto">
            <ul className="list">
                {ids.map(id => <DocumentItem key={id} id={id} />)}
            </ul>
        </div>
    );
}