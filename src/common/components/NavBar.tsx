import { useEffect, useMemo, type FC } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useLazyGetDocumentQuery } from "../../documents/document.api";
import { CreateDocument } from "./Header/CreateDocument";
import { DocList } from "./Header/DocList";
import { OnDocument } from "./Header/OnDocument";
import { OnNoteEdit } from "./Header/OnNoteEdit";
import { Sidebar } from "./Sidebar/Sidebar";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const patterns = {
    docs: /\/docs\/?$/,
    createDocument: /\/docs\/add$/,
    onDoc: /\/docs\/[0-9a-zA-Z-]+$/,
    onNoteEdit: /\/docs\/[0-9a-zA-Z-]+\/noteEdit\/[0-9a-zA-Z-]+$/,
    onSettings: /\/settings$/,
    onAbout: /\/about$/,
    onDocEdit: /\/docs\/[0-9a-zA-Z-]+\/edit$/,
    onDev: /\/dev$/,
    onAddNote: /\/addNote\/[0-9]+\/[0-9]+/
}

type Props = {
    showSidebar: boolean
    showBack: boolean
    title: string
}

export const NavBar: FC = () => {

    const { docId, noteId } = useParams<{docId: string, noteId: string}>()
    const [getDoc, { data: doc } ] = useLazyGetDocumentQuery()

    const { pathname } = useLocation()   
    const navigate = useNavigate()

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
        const showSidebar = (() => {
            if([
                patterns.onAbout,
                patterns.onSettings,
                patterns.onDoc,
                patterns.docs,
                patterns.onDev
            ].some(p => pathname.match(p))){
                return true
            }

            // if(pathname.match(patterns.onAbout))
            //     return true
            // if(pathname.match(patterns.onSettings))
            //     return true
            // if(pathname.match(patterns.onDoc))
            //     return true
            // if(pathname.match(patterns.docs))
            //     return true
            
            return false
        })()

        const showBack = (() => {
            if([
                patterns.onDocEdit, 
                patterns.onNoteEdit,
                patterns.onAddNote
            ].some(p => pathname.match(p)))
                return true
            return false
        })()

        const title = (() => {
            if(pathname.match(patterns.onSettings))
                return "Settings"
            if(pathname.match(patterns.onAbout))
                return "About"
            if(pathname.match(patterns.onDoc))
                return doc?.name ?? "Document"
            if(pathname.match(patterns.onDocEdit))
                return `Editing ${doc?.name ?? "..."}`
            if(pathname.match(patterns.onAddNote))
                return "Add Note"
            return "SRS Notes"
        })()


        return {
            showSidebar,
            title,
            showBack
        }
    }, [docId, noteId, pathname, doc])

    useEffect(() => {
        if(docId)
            getDoc(docId)
    }, [docId, getDoc])

    return (
        <div className="navbar bg-base-100 shadow-sm">

            <div className="flex-none px-3">
                {props.showSidebar && <Sidebar />}
                {props.showBack && (
                    <button
                        onClick={() => navigate(-1)}  
                    ><ArrowLeftIcon className="size-6" /></button>
                )}
            </div>

            <div className="flex-none px-3">
                <span>{props.title}</span>
            </div>

            {/* {!docId && <span>SRS Notes</span>}
            {docId && <Link to="..">Documents</Link>}

            {doc && <span>{doc.name}</span>}  */}
            {/* {content} */}
        </div>
    )
}