import type { FC } from "react";
import { useGetDocumentListQuery, useGetTrashedDocumentsQuery } from "../../document.api";
import { DocumentItem } from "../DocumentItem";
import { TrashLinkButton } from "../TrashLinkButton";

export const DocumentList: FC = () => {

    const {data: ids, isError, isLoading} = useGetDocumentListQuery();
    const { data: trashedIds } = useGetTrashedDocumentsQuery()

    if(isLoading){
        return <div>Loading document list...</div>
    }

    if(isError || ids === undefined){
        return (
            <div>Error occurred</div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-auto">
            <ul className="list">
                {ids.map(id => <DocumentItem key={id} id={id} />)}
                {trashedIds !== undefined && trashedIds.length > 0 && (
                    <li><TrashLinkButton /></li>
                )}
            </ul>
            {ids?.length === 0 && <div>No documents</div>}
        </div>
    );
}