import type { IDBPDatabase } from "idb"
import type { Db } from "../Db"
import { getLocalDb, type Tx } from "../LocalDb"
import { parse } from "papaparse"

export interface IDeletedNote {
    id: string
    timestamp: number
}

export const storeName = "deletedNotes"

export interface DeletedNoteDb {
    [storeName]: {
        key: string
        value: IDeletedNote
    }
}

export class DeletedNote implements IDeletedNote {
    id: string
    timestamp: number

    constructor(id: string, timestamp: number){
        this.id = id
        this.timestamp = timestamp
    }

    asPlain = (): IDeletedNote => ({id: this.id, timestamp: this.timestamp})

    static from = (note: IDeletedNote) => new DeletedNote(
        note.id,
        note.timestamp
    )

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(storeName, { keyPath: "id" })
        return store
    }

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll(storeName)
        const deleted = records.map(DeletedNote.from)
        return deleted
    } 

    static allTx = (tx: Tx) => tx.deletedNoteStore.getAll()

    static cleanTx = (tx: Tx) => { tx.deletedNoteStore.clear() }

    addTx = async (tx: Tx) => {
        await tx.deletedNoteStore.add(this.asPlain())
    }

    removeTx = async (tx: Tx) => {
        await tx.deletedNoteStore.delete(this.id)
    }

    toCsvRow = () => `${this.id},${this.timestamp}`

    static fromCsv = (csv: string): DeletedNote[] => {
        const data = parse(csv)
        const records = data.data as string[][]
        const items = records.map(row => {
            const [id, timestamp] = row
            return new DeletedNote(id, parseInt(timestamp))
        })
        return items
    } 
}
