import { type FC } from "react";
import { useParams } from "react-router";
import { List } from "../List";
import { useIncrementTime } from "../../hooks/incrTime";
import { ModeSelector } from "../ModeSelector/ModeSelector";
import { useAppSelector } from "../../../app/hooks";
import { selectMode } from "../../list.selectors";
import { AnswerPanel } from "../AnswerPanel/AnswerPanel";

export const ListPage: FC = () => {

    useIncrementTime()

    const { docId } = useParams<{docId: string}>() 
    const mode = useAppSelector(selectMode)

    if(!docId){
        return <div>docId not found in the url</div>
    }

    return (
        <>
            <List documentId={docId} /*height={400}*/ />
            {mode.kind === 'onAnswer' ? (
                <div className="absolute w-full bottom-0 left-0">
                    <AnswerPanel noteId={mode.noteId} />
                </div>
            ) : <ModeSelector />}
        </>
    )
}