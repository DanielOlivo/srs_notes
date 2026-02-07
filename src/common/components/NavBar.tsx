import { useEffect, useMemo, type FC } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../documents/document.api";
import { CreateDocument } from "./Header/CreateDocument";
import { DocList } from "./Header/DocList";
import { OnDocument } from "./Header/OnDocument";
import { OnNoteEdit } from "./Header/OnNoteEdit";
import { Sidebar } from "./Sidebar/Sidebar";

const patterns = {
    docs: /\/docs\/?$/,
    createDocument: /\/docs\/add$/,
    onDoc: /\/docs\/[0-9a-zA-Z-]+$/,
    onNoteEdit: /\/docs\/[0-9a-zA-Z-]+\/noteEdit\/[0-9a-zA-Z-]+$/,
    onSettings: /\/settings$/,
    onAbout: /\/about$/,
}

type Props = {
    showSidebar: boolean
    title: string
}

export const NavBar: FC = () => {

    const { docId, noteId } = useParams<{docId: string, noteId: string}>()
    const [getDoc, { data: doc } ] = useLazyGetDocumentQuery()

    const { pathname } = useLocation()   

    const content = useMemo(() => {
        if(pathname.match(patterns.onNoteEdit))
            return <OnNoteEdit />
        if(pathname.match(patterns.docs))
            return <DocList />
        if(pathname.match(patterns.createDocument))
            return <CreateDocument />
        if(pathname.match(patterns.onDoc))
            return <OnDocument />
        return null
    }, [pathname])

    const props = useMemo((): Props => {
        return {
            showSidebar: pathname.match(patterns.onSettings) !== null,
            title: (() => {
                if(pathname.match(patterns.onSettings))
                    return "Settings"
                if(pathname.match(patterns.onAbout))
                    return "About"
                return "SRS Notes"
            })()
        }
    }, [docId, noteId, pathname])

    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId, getDoc])

    return (
        <div className="navbar bg-base-100 shadow-sm">

            <div className="flex-none px-3">
                <Sidebar />
            </div>

            <div className="flex-none px-3">
                <span>{props.title}</span>
            </div>

            {/* {!docId && <span>SRS Notes</span>}
            {docId && <Link to="..">Documents</Link>}

            {doc && <span>{doc.name}</span>}  */}
            {content}
        </div>
    )
}