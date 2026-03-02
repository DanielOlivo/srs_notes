import type { IDBPDatabase } from "idb";
import type { IBaseNote } from "./Note";
import type { Db } from "../Db";
import { BaseNote } from "./Note.utils";
import { getLocalDb, type Tx } from "../LocalDb";
import { parse } from "papaparse";

export interface ClozeNoteData {
    kind: 'cloze'
    text: string
}

export interface IClozeNote extends IBaseNote, ClozeNoteData {}

export const clozeNoteStoreName = "closeNoteStore"

export interface ClozeNoteDb {
    [clozeNoteStoreName]: {
        key: string
        value: IClozeNote
    }
}

export class ClozeNote extends BaseNote implements  IClozeNote {
    text: string
    kind: ClozeNoteData['kind']

    constructor(id: string, createdAt: number, updatedAt: number, text: string){
        super(id, createdAt, updatedAt)
        this.text = text
        this.kind = 'cloze'
    }

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(clozeNoteStoreName, {keyPath: "id"})
        return store
    }

    static from = (note: IClozeNote) => new ClozeNote(
        note.id,
        note.createdAt,
        note.updatedAt,
        note.text
    )

    asPlain = (): IClozeNote => ({
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        text: this.text,
        kind: this.kind
    })

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll(clozeNoteStoreName)
        return records.map(ClozeNote.from)
    }

    static getTx = (noteId: string) => async (tx: Tx) => {
        const record = await tx.clozeNoteStore.get(noteId)
        return record ? ClozeNote.from(record) : null
    }  

    addTx = async (tx: Tx) => {
        await tx.clozeNoteStore.add(this.asPlain())
    }

    update = async () => {
        const db = await getLocalDb()
        this.updatedAt = Date.now()
        await db.put('closeNoteStore', this.asPlain())
    }

    remove = async () => {
        const db = await getLocalDb()
        await db.delete('closeNoteStore', this.id) 
    }

    toCsvRow = () => `${this.id},"${this.text}",${this.createdAt},${this.updatedAt}`
    static fromCsvRow = (row: string[]) => {
        const [id, text, createdAtStr, updatedAtStr] = row
        return new ClozeNote(
            id,
            parseInt(createdAtStr),
            parseInt(updatedAtStr),
            text
        )
    }

    static fromCsv = (csv: string) => {
        const data = parse(csv)
        const records = data.data as string[][]
        const notes = records.map(ClozeNote.fromCsvRow)
        return notes
    }
}