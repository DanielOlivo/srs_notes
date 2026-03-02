import type { FC } from "react";
import { GridDb } from "./GridDb";
import { NoteDb } from "./NoteDb";

export const DbView: FC = () => {

    return (
        <div className="w-full h-full tabs tabs-border">

            <input type="radio" name="dbtabs" className="tab" aria-label="Grid"/>
            <div className="tab-content">
                <GridDb />
            </div>

            <input type="radio" name="dbtabs" className="tab" aria-label="Note"/>
            <div className="tab-content">
                <NoteDb />
            </div>

        </div>
    )
}