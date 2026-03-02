import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import type { FC } from "react";
import { useNavigate } from "react-router";

export const CreateDocument: FC = () => {

    const navigate = useNavigate()

    return (
        <>
            <div className="flex-none">
                <button
                    onClick={() => navigate(-1)}
                ><ArrowLeftIcon className="size-5" /> </button> 
            </div>

            <div className="flex-none px-4">
                <span>Create Document</span>
            </div> 

            <div className="flex-1" />
        </>
    )    
}