import { useEffect, type FC } from "react";
import { useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../../documents/document.api";
import { HeaderElements } from "../../../common/components/HeaderElements";

export const DocumentHeaderElements: FC = () => {
    const { docId } = useParams<{docId: string}>()

    const [ getDoc, {data: doc}] = useLazyGetDocumentQuery()
    
    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId])

    return <HeaderElements buttonType="sidebar" title={doc?.name ?? "Document"} />
}