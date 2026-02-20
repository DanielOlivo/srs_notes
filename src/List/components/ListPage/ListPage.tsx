import { type FC } from "react";
import { useParams } from "react-router";
import { List } from "../List";
import { useIncrementTime } from "../../incrTime";
import { ModeSelector } from "../ModeSelector/ModeSelector";

export const ListPage: FC = () => {

    useIncrementTime()

    const { docId } = useParams<{docId: string}>() 

    if(!docId){
        return <div>docId not found in the url</div>
    }

    return (
        <>
            <List documentId={docId} /*height={400}*/ />
            <ModeSelector />
        </>
    )
}