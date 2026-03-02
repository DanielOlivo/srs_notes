import type { FC } from "react";
import { toZip } from "../../../db/csv";
import { DocumentLoader } from "../../../documents/components/DocumentLoader";

export const BackupPage: FC = () => {

    return (
        <div className="grid grid-cols-2 gap-2">

            <div>
                Export data
            </div>

            <div>
                <button
                    className="btn btn-accent" 
                    onClick={() => toZip()}
                >Export</button>
            </div>

            <div>
                Import data
            </div>

            <div>
                <DocumentLoader />
            </div>

        </div>
    )
}