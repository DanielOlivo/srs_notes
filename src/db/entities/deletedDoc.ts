import type { IDBPDatabase } from "idb"
import { getLocalDb, type Tx } from "../LocalDb"
import type { Db } from "../Db"
import { parse } from "papaparse"
import type { IDocId } from "../../documents/document.defs"

export interface IDeletedDoc {
    id: string
    timestamp: number
}

export const storeName = "deletedDocs"

export interface DeletedDocDb {
    [storeName]: {
        key: string
        value: IDeletedDoc
    }
}

export class DeletedDoc implements IDeletedDoc {
    id: string
    timestamp: number

    constructor(id: string, timestamp: number){
        this.id = id
        this.timestamp = timestamp
    }

    asPlain = (): IDeletedDoc => ({id: this.id, timestamp: this.timestamp})

    static from = (doc: IDeletedDoc) => new DeletedDoc(
        doc.id,
        doc.timestamp
    )

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(storeName, { keyPath: "id" })
        return store
    }

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll(storeName)
        const deleted = records.map(DeletedDoc.from)
        return deleted
    } 

    static allTx = (tx: Tx) => tx.deletedDocStore.getAll()

    static get = async (docId: IDocId) => {
        const db = await getLocalDb()
        const record = await db.get("deletedDocs", docId)
        return record ? DeletedDoc.from(record) : null
    }

    static cleanTx = (tx: Tx) => { tx.deletedDocStore.clear() }

    addTx = async (tx: Tx) => {
        await tx.deletedDocStore.add(this.asPlain())
    }

    remove = async () => {
        const db = await getLocalDb()
        await db.delete('deletedDocs', this.id)
    }

    removeTx = async (tx: Tx) => {
        await tx.deletedDocStore.delete(this.id)
    }

    toCsvRow = () => `${this.id},${this.timestamp}`

    static fromCsv = (csv: string): DeletedDoc[] => {
        const data = parse(csv)
        const records = data.data as string[][]
        const items = records.map(row => {
            const [id, timestamp] = row
            return new DeletedDoc(id, parseInt(timestamp))
        })
        return items
    } 
}
