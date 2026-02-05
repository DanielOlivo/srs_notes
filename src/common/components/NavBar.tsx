import { useEffect, useMemo, type FC } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../documents/document.api";
import { CreateDocument } from "./Header/CreateDocument";
import { DocList } from "./Header/DocList";

const patterns = {
    docs: /\/docs\/?$/,
    createDocument: /\/docs\/add$/
}

export const NavBar: FC = () => {

    const { docId } = useParams<{docId: string}>()
    const [getDoc, { data: doc } ] = useLazyGetDocumentQuery()

    const { pathname } = useLocation()   

    const content = useMemo(() => {
        if(pathname.match(patterns.docs))
            return <DocList />
        if(pathname.match(patterns.createDocument))
            return <CreateDocument />
        return null
    }, [pathname])


    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId, getDoc])

    return (
        <div className="navbar bg-base-100 shadow-sm">
            {/* {!docId && <span>SRS Notes</span>}
            {docId && <Link to="..">Documents</Link>}

            {doc && <span>{doc.name}</span>}  */}
            {content}
        </div>
    )
}