import { useEffect, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../../documents/document.api";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const OnDocument: FC = () => {

    const { docId } = useParams<{docId: string}>()
    const [getDoc, { data: doc }] = useLazyGetDocumentQuery()
    const navigate = useNavigate()

    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId, getDoc])

    return (
        <>
            <div className="flex-none">
                <button
                    onClick={() => navigate(-1)} 
                ><ArrowLeftIcon className="size-6"/></button>     
            </div> 

            <div className="flex-none">
                {doc && <span>{doc.name}</span>}
            </div>

            <div className="flex-1" />
        </>
    )
}