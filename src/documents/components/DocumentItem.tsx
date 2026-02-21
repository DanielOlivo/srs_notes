import { type FC } from "react";
import { Link, useNavigate } from "react-router";
import { useGetDocumentQuery } from "../document.api";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

export interface DocumentItemProps {
    id: string
}

export const DocumentItem: FC<DocumentItemProps> = ({id}) => {

    const { data: document, isLoading, isError, error } = useGetDocumentQuery(id)
    const navigate = useNavigate()


    if(isLoading){
        return <li className="list-row">Loading...</li>
    }

    if(isError || !document){
        return <li className="list-row">Error {errorToString(error)}</li>
    }

    return (
        <li className="list-row">

            <div>
                <p>
                    <Link to={`${document.id}`}>{document.name}</Link>
                </p>
            </div>

            <div className="list-col-grow" />

            <div>
                <button
                    popoverTarget={`popover-${id}`}
                    style={{ anchorName: `--anchor-${id}`}}
                >
                    <EllipsisVerticalIcon className="size-5" />
                </button>

                <ul
                    className="dropdown dropdown-end menu w-52 rounded-box bg-base-200 shadow-sm" 
                    popover="auto"
                    id={`popover-${id}`}
                    style={{ positionAnchor: `--anchor-${id}`}}
                >
                    <li><a
                        onClick={() => navigate(`${id}/edit`)} 
                    >Edit</a></li>

                    <li><a
                        onClick={() => navigate(`${id}/config`)}
                    >Config</a></li>
                </ul>
            </div>
        </li>
    )
}

function errorToString(err: unknown): string {
    if(typeof err === 'string')
        return err as string
    if(typeof err === 'object')
        return JSON.stringify(err)
    return `unknown error ${err}`
}