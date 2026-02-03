import { v4 } from "uuid";
import type { BasicNoteData, IBaseNote, IBasicNote, ITextNote, NoteType, TextNoteData } from "./Note";
import { faker } from "@faker-js/faker";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import type { IInterval } from "./interval";
import { parse } from 'papaparse'
import { getLocalDb, type Tx } from "../LocalDb";

export class BaseNote implements IBaseNote {
    @IsUUID()
    id: string

    @IsNumber()
    createdAt: number

    @IsNumber()
    updatedAt: number

    constructor(id: string, createdAt: number, updatedAt: number){
        this.id = id
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class BasicNote extends BaseNote implements IBasicNote {

    @IsString()
    @IsNotEmpty()
    front: string

    @IsString()
    @IsNotEmpty()
    back: string

    kind: BasicNoteData['kind']

    constructor(id: string, createdAt: number, updatedAt: number, front: string, back: string){
        super(id, createdAt, updatedAt)
        this.front = front
        this.back = back
        this.kind = "basic"
    }

    static random = (): IBasicNote => new BasicNote(
        v4(),
        Date.now(),
        Date.now(),
        faker.location.country(),
        faker.location.city(),
    )

    static all = async() => {
        const db = await getLocalDb()
        const records = await db.getAll('basicNoteStore')
        const notes = records.map(r => new BasicNote(
            r.id,
            r.createdAt,
            r.updatedAt,
            r.front,
            r.back
        ))
        return notes
    } 

    static cleanTx = () => (tx: Tx) => {
        return tx.basicNoteStore.clear()
    }

    static loadTx = (notes: IBasicNote[]) => notes.map(note => (tx: Tx) => tx.basicNoteStore.add(note))

    asPlain(): IBasicNote {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            front: this.front,
            back: this.back,
            kind: this.kind
        }
    }

    toCsvRow(){
        return `${this.id},"${this.front}","${this.back}",${this.createdAt},${this.updatedAt}`
    }

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const notes = records.map(row => {
            const [id, front, back, createdAtStr, updatedAtStr] = row
            return new BasicNote(
                id,
                parseInt(createdAtStr),
                parseInt(updatedAtStr),
                front,
                back
            )
        })
        return notes
    }

}

export class TextNote extends BaseNote implements ITextNote {

    text: string
    kind: TextNoteData['kind']

    constructor(id: string, createdAt: number, updatedAt: number, text: string) {
        super(id, createdAt, updatedAt)
        this.text = text
        this.kind = 'text'
    } 

    static random = (): ITextNote => new TextNote(
        v4(),
        Date.now(),
        Date.now(),
        faker.lorem.sentence(),
    )

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll('textNoteStore')
        const notes = records.map(r => new TextNote(
            r.id,
            r.createdAt,
            r.updatedAt,
            r.text
        ))
        return notes

    }

    static cleanTx = () => (tx: Tx) => {
        return tx.textNoteStore.clear()
    }

    static loadTx = (notes: ITextNote[]) => notes.map(note => (tx: Tx) => tx.textNoteStore.add(note))

    asPlain(): ITextNote {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            text: this.text,
            kind: this.kind
        }
    }

    toCsvRow(){
        return `${this.id},"${this.text}",${this.createdAt},${this.updatedAt}`
    }

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const notes = records.map(row => {
            const [id, text, createdAtStr, updatedAtStr] = row
            return new TextNote(
                id,
                parseInt(createdAtStr),
                parseInt(updatedAtStr),
                text
            )
        })
        return notes
    }

}

export class Interval implements IInterval {
    id: string
    noteId: string
    openDuration: number;
    openTimestamp: number;

    constructor(id: string, noteId: string,  openDuration: number, openTimestamp: number){
        this.id = id
        this.noteId = noteId
        this.openDuration = openDuration
        this.openTimestamp = openTimestamp
    }

    static randomForNote = (noteId: string) => new Interval(
        v4(),
        noteId,
        1000000,
        Date.now()
    )

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll("intervals")
        const intervals = records.map(r => new Interval(
            r.id,
            r.noteId,
            r.openDuration,
            r.openTimestamp
        ))
        return intervals
    }

    static cleanTx = () => (tx: Tx) => {
        return tx.intervalStore.clear()
    }

    static loadTx = (intervals: IInterval[]) => intervals.map(interval => (tx: Tx) => tx.intervalStore.add(interval))

    asPlain = (): IInterval => ({
        id: this.id,
        noteId: this.noteId,
        openDuration: this.openDuration,
        openTimestamp: this.openTimestamp
    })

    toCsvRow = () => `${this.id},${this.noteId},${this.openDuration},${this.openTimestamp}`

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const notes = records.map(row => {
            const [id, noteId, openDurationStr, openTimestampStr] = row
            return new Interval(
                id,
                noteId,
                parseInt(openDurationStr),
                parseInt(openTimestampStr),
            )
        })
        return notes
    }
}