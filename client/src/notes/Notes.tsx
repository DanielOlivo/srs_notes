import type { FC } from "react";
import { NoteList } from "./components/NoteList";
import { CreateBasicNote } from "./components/CreateBasicNote";
import { DumpButton } from "./components/DumpButton";
import { ClearAllButton } from "./components/ClearAllButton";
import { SeedButton } from "./components/SeedButton";

export const Notes: FC = () => {



    return (
        <div className="w-full h-full flex flex-col justify-between items-stretch">
            <NoteList />
            <CreateBasicNote /> 
            <div className="flex flex-row justify-between items-center">
                <DumpButton />
                <SeedButton />
                <ClearAllButton />
            </div>
        </div>
    )
}