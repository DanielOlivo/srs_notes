import JSZip from 'jszip'
import { Document } from './Document'
import type { IDocument } from './entities/document'
import type { IBasicNote, ITextNote } from './entities/Note'
import { BasicNote, ImageNote, Interval, TextNote } from './entities/Note.utils'
import type { IInterval } from './entities/interval'
import { Position, type IPosition } from './entities/position'
import { Answer, type IAnswer } from './entities/answer'
import { saveAs } from 'file-saver'
import { DeletedDoc, type IDeletedDoc } from './entities/deletedDoc'
import type { IImageNote } from './entities/ImageNote'
import { withTx } from './LocalDb'
import { ClozeNote, type IClozeNote } from './entities/cloze'

const targetFiles = [
    "docs.csv",
    "basicNotes.csv",
    "textNotes.csv",
    "imageNotes.csv",
    "clozeNotes.csv",
    "positions.csv",
    "answers.csv",
    "intervals.csv",
    "deletedDocs.csv"
]

const imgFolderName = "img"

export type Data = {
    docs: IDocument[]
    basicNotes: IBasicNote[]
    textNotes: ITextNote[]
    intervals: IInterval[]
    positions: IPosition[]
    answers: IAnswer[]
    deletedDocs: IDeletedDoc[]
    images: Omit<IImageNote, 'data'>[]
    cloze: IClozeNote[]
}

export const proceedZip = async (file: File) => {
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
        clozeNotesCsvString,
        positionsCsvString,
        answersCsvString,
        intervalsCsvString,
        deletedDocsCsvString
    ] = await Promise.all(
        targetFiles.map(file => containedFiles[file].async('string'))
    )
    
    const images = ImageNote.fromCsv(imageNotesCsvString)
    const imgFolder = zip.folder(imgFolderName)
    const blobs = (imgFolder && Object.fromEntries(
        await Promise.all(
            Object.entries(imgFolder.files).map(async ([name, file]) => {
                const [path, ext] = name.split('.')
                const pathParts = path.split('/')
                const id = pathParts[pathParts.length - 1]
                if(!ImageNote.isValidType(ext))
                    return [id, undefined]
                const blob = await file.async('blob')
                return [id, blob] 
            })
        )
    )) ?? {}

    const saveImageNotes = async () => {
        try{
            const notes = images
                .filter(img => img.id in blobs)
                .map(img => blobs[img.id] && new ImageNote(
                    img.id,
                    img.createdAt,
                    img.updatedAt,
                    img.name,
                    blobs[img.id]
                ))
            await withTx(
                ...notes.map(note => note.addTx)
            )
        }
        catch(error){
            console.error(`Failed to save images: ${error}`)
        }
    }

    // better return function!
    const data = {
        docs: Document.fromCsv(docCsvString).map(doc => doc.asPlain()),
        basicNotes: BasicNote.fromCsv(basicNotesCsvString).map(note => note.asPlain()),
        textNotes: TextNote.fromCsv(textNotesCsvString).map(note => note.asPlain()),
        intervals: Interval.fromCsv(intervalsCsvString).map(interval => interval.asPlain()),
        positions: Position.fromCsv(positionsCsvString).map(pos => pos.asPlain()),
        answers: Answer.fromCsv(answersCsvString).map(answer => answer.asPlain()),
        deletedDocs: DeletedDoc.fromCsv(deletedDocsCsvString).map(doc => doc.asPlain()),
        images: ImageNote.fromCsv(imageNotesCsvString),
        cloze: ClozeNote.fromCsv(clozeNotesCsvString).map(note => note.asPlain())
    }

    return { data, blobs, saveImageNotes }
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

    const clozeNotes = await ClozeNote.all()
    const clozeNoteCsv = clozeNotes.map(note => note.toCsvRow()).join("\n")
    zip.file("clozeNotes.csv", clozeNoteCsv)


    // const imageNoteCsv = ""
    // zip.file("imageNotes.csv", imageNoteCsv)

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

    const imgFolder = zip.folder(imgFolderName)
    const images = await ImageNote.all()
    if (imgFolder) {
        await Promise.all(
            images.map(img => img.saveImage(imgFolder))
        )
    }
    const imageCsv = images.map(i => i.toCsvRow()).join("\n")
    zip.file("imageNotes.csv", imageCsv)

    

    const blob = await zip.generateAsync({type: "blob"})
    saveAs(blob, 'dump.zip') 

}