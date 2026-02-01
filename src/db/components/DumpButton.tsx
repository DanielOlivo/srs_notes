import type { FC } from "react";
import { getDb } from "../LocalDb";
import type { IDocument } from "../entities/document";
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export const DumpButton: FC = () => {
    return (
        <button 
            className="btn btn-info"
            onClick={getDump}
        >Dump</button>
    )
}

const docHeader = "id;name;createdAt;type"
const docToCSVRow = (doc: IDocument): string => `${doc.id};"${doc.name}";${doc.createdAt};${doc.type}`

const getDump = async () => {
    const db = await getDb()

    const docs = await db.getDocumentList()

    const docCsv = [
        docHeader,
        ...docs.map(docToCSVRow)
    ].join("\n")  

    const zip = new JSZip()
    zip.file("docs.csv", docCsv)

    const blob = await zip.generateAsync({type: "blob"})

    saveAs(blob, 'dump.zip') 
}