import type { FC } from "react";
import { DocumentList } from "./components/DocumentList/DocumentList";
import { DocumentControls } from "./components/DocumentControls";
import { DocumentLoader } from "./components/DocumentLoader";
import { CleanAllButton } from "../db/components/CleanAll";
import { SeedButton } from "../db/components/SeedButton";
import { TestButton } from "../db/components/TestButton";
import { DumpButton } from "../db/components/DumpButton";
import { Link, useNavigate } from "react-router";

/** list and buttons */
export const Documents: FC = () => {

    const navigate = useNavigate() 

    return (
        <div className="w-full h-full flex flex-col justify-start items-stretch">
            <DocumentList />
            {/* <CleanAllButton /> */}
            {/* <SeedButton /> */}
            {/* <TestButton /> */}
            {/* <DocumentLoader /> */}
            {/* <DumpButton /> */}

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