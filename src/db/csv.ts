import { parse } from 'papaparse'
import JSZip from 'jszip'
import { Document } from './Document'
import type { IDocument } from './entities/document'
import type { IBasicNote, ITextNote } from './entities/Note'
import { BasicNote, Interval, TextNote } from './entities/Note.utils'
import type { IInterval } from './entities/interval'

const targetFiles = [
    "docs.csv",
    "basicNotes.csv",
    "textNotes.csv",
    "imageNote.csv",
    "positions.csv",
    "answers.csv",
    "intervals.csv"
]

type Data = {
    docs: IDocument[]
    basicNotes: IBasicNote[]
    textNotes: ITextNote[]
    intervals: IInterval[]
}

export const proceedZip = async (file: File): Promise<Data> => {
    const zip = await JSZip.loadAsync(file)
    const containedFiles = zip.files

    for(const file of targetFiles){
        if(!containedFiles[file])
            throw new Error(`file ${file} not found`)
    }
    
    const [
        docCsvString,
        basicNotesCsvString,
        textNotesCsvString,
        imageNotesCsvString,
        positionsCsvString,
        answersCsvString,
        intervalsCsvString
    ] = await Promise.all(
        targetFiles.map(file => containedFiles[file].async('string'))
    )
    
    return {
        docs: Document.fromCsv(docCsvString).map(doc => doc.asPlain()),
        basicNotes: BasicNote.fromCsv(basicNotesCsvString).map(note => note.asPlain()),
        textNotes: TextNote.fromCsv(textNotesCsvString).map(note => note.asPlain()),
        intervals: Interval.fromCsv(intervalsCsvString).map(interval => interval.asPlain())

    }
}