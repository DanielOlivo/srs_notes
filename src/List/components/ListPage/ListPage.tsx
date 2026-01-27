import type { FC } from "react";
import { useParams } from "react-router";

export const ListPage: FC = () => {

    const { docId } = useParams<{docId: string}>() 

    return <>List page: {docId}</>
}