import type { FC } from "react";
import { useParams } from "react-router";
import { List } from "../List";
import { Controls } from "../Controls/Controls";
import { Outlet } from "react-router";

export const ListPage: FC = () => {

    const { docId } = useParams<{docId: string}>() 

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
                <Outlet />
            </div>
        </div>
    )
}