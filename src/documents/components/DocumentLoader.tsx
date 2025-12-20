import { type FC, type ChangeEvent } from "react";
import { getDb } from "../../db/LocalDb";
import { useUploadDocumentMutation } from "../document.api";

export const DocumentLoader: FC = () => {
    const [loadDocument] = useUploadDocumentMutation(); 

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            loadDocument(file);
        } catch (error) {
            console.error("Failed to upload document:", error);
            // Handle errors, e.g., show an error message to the user.
        }
    };

    return (
        <div>
            <label>Upload CSV Document:</label>
            <input type="file" accept=".csv, text/csv" onChange={handleFileChange} />
        </div>
    );
};