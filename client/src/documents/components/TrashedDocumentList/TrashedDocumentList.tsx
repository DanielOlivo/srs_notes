import type { FC } from "react";
import { useGetTrashedDocumentsQuery } from "../../document.api";
import { TrashedDocumentListItem } from "./TrashedDocumentListItem";
import type { IDocId } from "../../document.defs";

export const TrashedDocumentList: FC = () => {

    const { data: ids } = useGetTrashedDocumentsQuery()

    return (
        <ul className="list">
            {ids?.map(id => <TrashedDocumentListItem docId={id as IDocId} />)}
        </ul>
    )
}