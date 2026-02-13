import { parse } from 'papaparse'
import JSZip from 'jszip'
import { Document } from './Document'
import type { IDocument } from './entities/document'
import type { IBasicNote, ITextNote } from './entities/Note'
import { BasicNote, Interval, TextNote } from './entities/Note.utils'
import type { IInterval } from './entities/interval'
import { Position, type IPosition } from './entities/position'
import { Answer, type IAnswer } from './entities/answer'
import { saveAs } from 'file-saver'
import { DeletedDoc, type IDeletedDoc } from './entities/deletedDoc'

const targetFiles = [
    "docs.csv",
    "basicNotes.csv",
    "textNotes.csv",
    "imageNote.csv",
    "positions.csv",
    "answers.csv",
    "intervals.csv",
    "deletedDocs.csv"
]

export type Data = {
    docs: IDocument[]
    basicNotes: IBasicNote[]
    textNotes: ITextNote[]
    intervals: IInterval[]
    positions: IPosition[]
    answers: IAnswer[]
    deletedDocs: IDeletedDoc[]
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
        intervalsCsvString,
        deletedDocsCsvString
    ] = await Promise.all(
        targetFiles.map(file => containedFiles[file].async('string'))
    )
    
    return {
        docs: Document.fromCsv(docCsvString).map(doc => doc.asPlain()),
        basicNotes: BasicNote.fromCsv(basicNotesCsvString).map(note => note.asPlain()),
        textNotes: TextNote.fromCsv(textNotesCsvString).map(note => note.asPlain()),
        intervals: Interval.fromCsv(intervalsCsvString).map(interval => interval.asPlain()),
        positions: Position.fromCsv(positionsCsvString).map(pos => pos.asPlain()),
        answers: Answer.fromCsv(answersCsvString).map(answer => answer.asPlain()),
        deletedDocs: DeletedDoc.fromCsv(deletedDocsCsvString).map(doc => doc.asPlain())
    }
}

export const toZip = async () => {
    const zip = new JSZip()

    const docs = await Document.all()
    const docCsv = docs.map(doc => doc.toCsvRow()).join('\n')
    zip.file("docs.csv", docCsv)

    const basicNotes = await BasicNote.all()
    const basicNotesCsv = basicNotes.map(note => note.toCsvRow()).join("\n")
    zip.file("basicNotes.csv", basicNotesCsv)

    const textNotes = await TextNote.all()
    const textNoteCsv = textNotes.map(note => note.toCsvRow()).join("\n")
    zip.file("textNotes.csv", textNoteCsv)

    const imageNoteCsv = ""
    zip.file("imageNote.csv", imageNoteCsv)

    const positions = await Position.all()
    const positionCsv = positions.map(p => p.toCsvRow()).join("\n")
    zip.file("positions.csv", positionCsv)

    const intervals = await Interval.all()    
    const intervalCsv = intervals.map(i => i.toCsvRow()).join("\n")
    zip.file("intervals.csv", intervalCsv)

    const answers = await Answer.all()
    const answerCsv = answers.map(a => a.toCsvRow()).join("\n")
    zip.file("answers.csv", answerCsv)

    const deletedDocs = await DeletedDoc.all()
    const deletedDocsCsv = deletedDocs.map(d => d.toCsvRow()).join("\n")
    zip.file("deletedDocs.csv", deletedDocsCsv)

    // const imgFolder = zip.folder("img")

    const blob = await zip.generateAsync({type: "blob"})
    saveAs(blob, 'dump.zip') 

}