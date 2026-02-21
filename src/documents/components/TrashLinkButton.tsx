import { TrashIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { Link } from "react-router";

export const TrashLinkButton: FC = () => {
    return <Link to="/docs/trash">
        <span className="flex flex-row justify-start items-center text-secondary"><TrashIcon className="size-6 mr-3" />Trash</span>
    </Link>

}