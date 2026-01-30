import type { FC } from "react";
import { DocumentList } from "./components/DocumentList/DocumentList";
import { DocumentControls } from "./components/DocumentControls";
import { DocumentLoader } from "./components/DocumentLoader";
import { CleanAllButton } from "../db/components/CleanAll";
import { SeedButton } from "../db/components/SeedButton";
import { TestButton } from "../db/components/TestButton";

/** list and buttons */
export const Documents: FC = () => {

    

    return (
        <div className="w-full h-full flex flex-col justify-start items-stretch">
            <DocumentList />
            <CleanAllButton />
            <SeedButton />
            <TestButton />
            <DocumentLoader />
        </div>
    )
}