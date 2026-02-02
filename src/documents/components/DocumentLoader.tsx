import { type FC, type ChangeEvent, useState } from "react";
import { getDb } from "../../db/LocalDb";
import { useUploadDocumentMutation } from "../document.api";
import JSZip from "jszip";
import type { IDocument } from "../../db/entities/document";
import { Document } from "../../db/Document";

interface Data {
    docs: IDocument[]
}

export const DocumentLoader: FC = () => {
    const [loadDocument] = useUploadDocumentMutation(); 
    const [docs, setDocs] = useState<IDocument[]>([]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            console.log('no file provided')
            return;
        }

        try {
            const zip = await JSZip.loadAsync(file);

            const data: Data = {
                docs: []
            }

            const docsCsv = zip.file("docs.csv");
            if(docsCsv){
                const content = await docsCsv.async("string")
                data.docs = Document.fromCsv(content)
            } 

        } catch (error) {
            console.error("Failed to upload document:", error);
            // Handle errors, e.g., show an error message to the user.
        }
    };

    return (
        <div>
            <label>Upload CSV Document:</label>
            <input type="file" accept=".zip, text/csv" onChange={handleFileChange} />
        </div>
    );
};