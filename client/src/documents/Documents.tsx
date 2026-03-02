import type { FC } from "react";
import { DocumentList } from "./components/DocumentList/DocumentList";
import { useNavigate } from "react-router";

/** list and buttons */
export const Documents: FC = () => {

    const navigate = useNavigate() 

    return (
        <div className="w-full h-full flex flex-col justify-start items-stretch">
            <DocumentList />

            <div className="fab">
                <button
                    className="btn btn-lg btn-circle btn-primary"
                    onClick={() => {
                        // console.log('hello')
                        navigate("add")
                    }} 
                >+</button>
                {/* <Link to="add">+</Link> */}
            </div>
        </div>
    )
}