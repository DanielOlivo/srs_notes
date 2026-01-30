import type { FC } from "react";
import { useParams } from "react-router";
import { List } from "../List";

export const ListPage: FC = () => {

    const { docId } = useParams<{docId: string}>() 

    if(!docId){
        return <div>docId not found in the url</div>
    }

    return (
        <div>
            <List documentId={docId} />
        </div>
    )
}