import { /*useCallback, */ type FC } from "react";
import { useParams } from "react-router";
import { List } from "../List";
import { Controls } from "../Controls/Controls";
// import { Outlet } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { /*selectEditMode, */ selectMode } from "../../list.selectors";
import { NoteEdit } from "../../../notes/components/NoteEdit/NoteEdit";

export const ListPage: FC = () => {

    const { docId } = useParams<{docId: string}>() 
    // const editMode = useAppSelector(selectEditMode)
    const mode = useAppSelector(selectMode)

    const controls = () => {
        switch(mode.kind){
            // case 'none': return null
            case 'new': return <NoteEdit />
            case 'onUpdate': return <NoteEdit id={mode.noteId} />
            default: return null
        }
    }

    if(!docId){
        return <div>docId not found in the url</div>
    }

    return (
        <div className="h-full w-full grid grid-cols-1 grid-rows-8 gap-2">

            <div className="row-span-7">
                <List documentId={docId} height={400}/>
            </div>

            <div>
                <Controls />
            </div>

            <div className="">
                {/* <Outlet /> */}
                {controls()}
            </div>
        </div>
    )
}