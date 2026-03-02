import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useNavigate } from "react-router";

export const BackButton: FC = () => {

    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}  
        ><ArrowLeftIcon className="size-6" /></button>
    )
}