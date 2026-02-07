import { useEffect, useMemo, type FC } from "react";
import { useNavigate, useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../../documents/document.api";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../app/hooks";
import { selectMode } from "../../../List/list.selectors";

export const OnDocument: FC = () => {

    const { docId } = useParams<{docId: string}>()
    const [getDoc, { data: doc }] = useLazyGetDocumentQuery()
    const navigate = useNavigate()
    const mode = useAppSelector(selectMode)

    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId, getDoc])

    const modeTitle = useMemo(() => {
        switch(mode.kind) {
            case "edit": case "onUpdate": return "Edit"
            case "none": return "Normal"
            case "onReview": case "onAnswer": return "Review"
        }
    }, [mode])

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

            <div className="flex-1">
                <span>{modeTitle}</span>
            </div>
        </>
    )
}