import { useCallback, type FC } from "react";
import { Link, useParams } from "react-router";
import { setListMode, type ListMode } from "../../list.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { selectMode } from "../../list.selectors";
import { EyeIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";

export const ModeSelector: FC = () => {

    const { docId } = useParams<{docId: string}>()
    const dispatch = useAppDispatch()

    const mode = useAppSelector(selectMode)

    if(!docId)
        return null

    return (
        <div
            className="fab"
        >
            <div tabIndex={0} role="button" className="btn btn-lg btn-info btn-circle">
                <PencilSquareIcon className="size-7" />
            </div>

            <div className="fab-close">
                <span className="btn btn-circle btn-lg btn-error">
                    <XCircleIcon className="size-7" />
                </span>
            </div>

            <div className="tooptip" data-tip="Toggle visibility">
                <button 
                    className="btn btn-lg btn-circle btn-info"
                    onClick={() => dispatch(
                        setListMode(
                            {kind: mode.kind === "showAll" ? "none" : "showAll"}
                        )
                    )}
                >
                    {
                        mode.kind === "showAll"
                        ? <EyeIcon className="size-7" />
                        : <EyeSlashIcon className="size-7" />
                    }
                </button>
            </div>

            <div className="tooltip" data-tip="Add new note">
                <Link
                    className="btn btn-lg btn-circle btn-info"
                    to={`addNote`}
                ><PlusIcon className="size-7" /></Link>
            </div>

        </div>
    )
}