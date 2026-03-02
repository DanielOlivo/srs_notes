import { type FC, type ChangeEvent, useState, useRef } from "react";
// import { useUploadDocumentMutation } from "../document.api";
import { proceedZip, type Data } from "../../db/csv";
import { useRestoreFromBackupMutation } from "../document.api";
// import { set } from "react-hook-form";


export const DocumentLoader: FC = () => {
    const [restore, ] = useRestoreFromBackupMutation()
    const [data, setData] = useState<Data | null>(null);

    const saveNonserializableRef = useRef<(() => Promise<void>) | null>(null)

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            console.log('no file provided')
            return;
        }

        try {
            const { data, saveImageNotes } = await proceedZip(file)
            setData(data)
            saveNonserializableRef.current = saveImageNotes
        } catch (error) {
            console.error("Failed to upload document:", error);
        }
    };

    const handleLoading = async () => {
        if(!data) return
        await restore(data)
        await saveNonserializableRef.current?.()
        setData(null)
        saveNonserializableRef.current = null
    }

    return (
        <div className="w-full grid grid-cols-1 grid-rows-2">

            <div>
                <input type="file" className="file-input" accept=".zip, text/csv" onChange={handleFileChange} />
            </div>

            <div>
                {data && (
                    <div className="flex flex-col justify-start items-start">
                        <span>Docs: {data.docs.length}</span>
                        <span>BasicNotes: {data.basicNotes.length}</span>
                        <button onClick={handleLoading}>Replace</button>
                    </div>
                )}
            </div>
        </div>
    );
};