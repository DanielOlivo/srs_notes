import type { FC } from "react";
import type { DocumentId } from "../../document.defs";
import { useGetDocumentQuery, useRestoreDocumentMutation } from "../../document.api";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export const TrashedDocumentListItem: FC<DocumentId> = ({docId}) => {

    const { data: doc, isError } = useGetDocumentQuery(docId)
    const [restoreDoc, ] = useRestoreDocumentMutation()

    const handleRestoreClick = () => {
        if(!doc) return
        restoreDoc(docId)
    }
    
    return (
        <li className="list-row">

            {isError && <div className="list-col-grow">Failed to load document</div>}

            {!isError && doc && (
                <>
                    <div className="list-col-grow">{doc.name}</div>
                    <div className="tooltip">
                        <button
                            data-tip="Restore"
                            className="btn btn-neutral btn-outline"
                            onClick={handleRestoreClick}
                        ><ArrowUpTrayIcon className="size-6" /></button>
                    </div>
                </>
            )}

        </li>
    )
}