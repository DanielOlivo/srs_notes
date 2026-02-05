import type { FC } from "react";
import { useNavigate } from "react-router";

export const CreateDocument: FC = () => {

    const navigate = useNavigate()

    return (
        <>
            <div className="flex-none">
                <button
                    onClick={() => navigate(-1)}
                >back</button> 
            </div>

            <div className="flex-1">
                <span>Create Document</span>
            </div> 
        </>
    )    
}