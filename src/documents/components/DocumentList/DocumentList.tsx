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

    return (
        <div className="w-full h-full overflow-y-auto">
            {ids.length > 0 ? (
                <>
                    <ul className="list">
                        {ids.map(id => <DocumentItem key={id} id={id} />)}
                    </ul>
                </>
            ) : (
                <div>No documents</div>
            )}
        </div>
    );
}