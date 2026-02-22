import { v4 } from "uuid";
import { basicNoteStoreName, imageNoteStoreName, textNoteStoreName, type BasicNoteData, type IBaseNote, type IBasicNote, type ITextNote, type TextNoteData } from "./Note";
import { faker } from "@faker-js/faker";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
import type { IInterval } from "./interval";
import { parse } from 'papaparse'
import { getLocalDb, type Tx } from "../LocalDb";
import { type IImageNote } from "./ImageNote";
import type JSZip from "jszip";
import type { IDBPDatabase } from "idb";
import type { Db } from "../Db";

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

    // static getTx = (noteId: string) => async (tx: Tx) => {
    //     const [basic, text, image] = await Promise.all([
    //         BasicNote.getTx(noteId)(tx),
    //         TextNote.getTx(noteId)(tx),
    //         ImageNote.getTx(noteId)(tx)
    //     ])
    //     return basic ?? text ?? image ?? null
    // }
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

    static createStore = (db: IDBPDatabase<Db>) => {
        const basicStore = db.createObjectStore(basicNoteStoreName, {keyPath: "id"})
        return basicStore
    }

    static from = (note: IBasicNote) => new BasicNote(
        note.id,
        note.createdAt,
        note.updatedAt,
        note.front,
        note.back
    )

    static random = () => new BasicNote(
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

    static get = async (noteId: string) => {
        const db = await getLocalDb()
        const record = await db.get("basicNoteStore", noteId)
        if(!record)
            return null
        return new BasicNote(
            record.id,
            record.createdAt,
            record.updatedAt,
            record.front,
            record.back
        )
    }

    static getTx = (noteId: string) => async (tx: Tx): Promise<BasicNote | null> => {
        const record = await tx.basicNoteStore.get(noteId)
        if(!record)
            return null
        return new BasicNote(
            record.id,
            record.createdAt,
            record.updatedAt,
            record.front,
            record.back
        )
    }

    addTx = async (tx: Tx) => {
        try{
            await tx.basicNoteStore.add(this.asPlain())
        }
        catch(error){
            throw new Error(`BasicNote ${this.toCsvRow()}; addTx failure: ${error}`)
        }
    }

    update = async () => {
        const db = await getLocalDb()
        this.updatedAt = Date.now() 
        await db.put("basicNoteStore", this.asPlain())
    }

    removeTx = async (tx: Tx) => {
        await tx.basicNoteStore.delete(this.id)
    }

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

    static createStore = (db: IDBPDatabase<Db>) => {
        const textStore = db.createObjectStore(textNoteStoreName, {keyPath: "id"})
        return textStore
    }

    static from = (note: ITextNote) => new TextNote(
        note.id,
        note.createdAt,
        note.updatedAt,
        note.text
    )


    static random = () => new TextNote(
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

    static getTx = (noteId: string) => async (tx: Tx): Promise<TextNote | null> => {
        const record = await tx.textNoteStore.get(noteId)
        if(!record)
            return null
        return new TextNote(
            record.id,
            record.createdAt,
            record.updatedAt,
            record.text
        )
    }

    addTx = async (tx: Tx) => {
        await tx.textNoteStore.add(this.asPlain())
    }

    update = async () => {
        const db = await getLocalDb()
        this.updatedAt = Date.now() 
        await db.put("textNoteStore", this.asPlain())
    }

    removeTx = async (tx: Tx) => {
        await tx.textNoteStore.delete(this.id)
    }

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

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore("intervals", {keyPath: "id"})
        store.createIndex("by-noteId", "noteId", {unique: false})
        return store
    }

    static from = (interval: IInterval) => new Interval(
        interval.id,
        interval.noteId,
        interval.openDuration,
        interval.openTimestamp
    )

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

    static getByNoteId = async (noteId: string) => {
        const db = await getLocalDb()
        const record = await db.getFromIndex("intervals", "by-noteId", noteId)
        if(!record)
            return null
        return new Interval(
            record.id,
            record.noteId,
            record.openDuration,
            record.openTimestamp
        )
    }

    static getByNoteIdTx = (noteId: string) => async(tx: Tx) => {
        const record = await tx.intervalStore.index('by-noteId').get(noteId) // .index("by-noteId", noteId)
        if(!record)
            return null
        return new Interval(
            record.id,
            record.noteId,
            record.openDuration,
            record.openTimestamp
        )
    }

    addTx = async (tx: Tx) => {
        try{
            await tx.intervalStore.add(this.asPlain())
            return
        }
        catch(error){
            throw new Error(`Interval ${this}; addTx failure: ${error}`)
        }
    }

    updateTx = (nextInterval: number) => (tx: Tx) => {
        this.openDuration = nextInterval
        this.openTimestamp = Date.now()
        return tx.intervalStore.put(this.asPlain())
    }

    remove = async () => {
        const db = await getLocalDb()
        await db.delete("intervals", this.id)
    }

    removeTx = () => async (tx: Tx): Promise<void> => {
        await  tx.intervalStore.delete(this.id)
    }

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


export class ImageNote extends BaseNote implements IImageNote {

    kind: 'image'
    name: string
    data: Blob

    constructor(id: string, createdAt: number, updatedAt: number, name: string, data: Blob){
        super(id, createdAt, updatedAt)
        this.name = name
        this.data = data
        this.kind = 'image'
    }

    static createStore = (db: IDBPDatabase<Db>) => {
        const imageStore = db.createObjectStore(imageNoteStoreName, {keyPath: "id"})
        return imageStore
    }

    static from = (note: IImageNote): ImageNote => new ImageNote(
        note.id,
        note.createdAt,
        note.updatedAt,
        note.name,
        note.data
    )

    static random = async () => {
        const imageUrl = faker.image.urlPicsumPhotos()
        const res = await fetch(imageUrl)
        const blob = await res.blob()
        const name = faker.lorem.word()
        return new ImageNote(
            faker.string.uuid(),
            Date.now(),
            Date.now(),
            name,
            blob
        )
    }

    asPlain = (): IImageNote => ({
        id: this.id,
        kind: "image",
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        name: this.name,
        data: this.data
    })

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll("imageNoteStore")
        return records.map(ImageNote.from)
    }

    static get = async (id: string) => {
        const db = await getLocalDb()
        const record = await db.get("imageNoteStore", id)
        return (record && ImageNote.from(record)) ?? null
    }

    static getTx = (id: string) => async (tx: Tx): Promise<ImageNote | null> => {
        const record = await tx.imageNoteStore.get(id)
        if(!record) return null
        return ImageNote.from(record)
    }

    addTx = async (tx: Tx) => {
        await tx.imageNoteStore.add(this.asPlain())
    }

    updateTx = async(tx: Tx) => {
        await tx.imageNoteStore.put(this.asPlain())
    }

    toCsvRow = () => `${this.id},"${this.name}",${this.createdAt},${this.updatedAt}`

    static fromCsv = (csv: string): Omit<IImageNote, 'data'>[] => {
        const data = parse(csv)
        const records = data.data as string[][]
        const notes = records.map(row => {
            const [id, name, createdAtStr, updatedAtStr] = row
            return {
                id,
                kind: 'image',
                createdAt: parseInt(createdAtStr),
                updatedAt: parseInt(updatedAtStr),
                name,
            } satisfies Omit<IImageNote, 'data'>
        })
        return notes
    }

    static isValidType = (type: string) => {
        return new Set(['png', 'jpg', 'gif', 'svg']).has(type)
    }

    saveImage = async (imgFolder: JSZip) => {
        const type = await ImageNote.getType(this.data)
        if(!type){
            throw new Error(`ImageNote ${this.id}, ${this.name}: unknown image type`)
        }
        imgFolder.file(`${this.id}.${type}`, this.data)
    }

    static getType = async (blob: Blob) => {
        const buffer = await blob.slice(0, 12).arrayBuffer()
        const bytes = new Uint8Array(buffer)
        
        if(
            bytes[0] === 0x89 &&
            bytes[1] === 0x50 &&
            bytes[2] === 0x4E &&
            bytes[3] === 0x47
        ){
            return 'png'
        }

        if(bytes[0] === 0xFF && bytes[1] === 0xD8){
            return 'jpg'
        }

        if(
            bytes[0] === 0x47 &&
            bytes[1] === 0x49 &&
            bytes[2] === 0x46 && 
            bytes[3] === 0x38
        ){
            return "gif"
        }

        const text = (await blob.slice(0, 200).text()).trim()
        if(text.startsWith("<svg")){
            return "svg"
        }
        return null
    }
}

