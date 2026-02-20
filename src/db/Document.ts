import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import type { IDocument } from "./entities/document";
import { v4 } from "uuid";
import { getLocalDb, type Tx } from "./LocalDb";
import { parse } from 'papaparse'
import type { Db } from "./Db";
import type { IDBPDatabase } from "idb";

const storeName = "documents"

export class Document implements IDocument {

    @IsUUID()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    type: IDocument['type']

    createdAt: number

    constructor(name: string, type: IDocument['type'], id?: string, createdAt?: number){
        this.id = id ?? v4()
        this.name = name
        this.type = type
        this.createdAt = createdAt ?? Date.now() 
    }

    static createStore = (db: IDBPDatabase<Db> ) => {
        const store = db.createObjectStore(storeName, {keyPath: "id"})
        store.createIndex("by-name", "name", {unique: false})
        return store
    }

    asPlain(): IDocument {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            createdAt: this.createdAt
        }
    }

    static from =(doc: IDocument) => new Document(doc.name, doc.type, doc.id, doc.createdAt)

    private static async db () {
        const db = await getLocalDb()
        return db
    }

    static async all(){
        const db = await Document.db()
        const records = await db.getAll("documents")
        const docs = records.map(r => new Document(r.name, r.type, r.id, r.createdAt))
        return docs
    }

    static allTx = async (tx: Tx) => {
        const records = await tx.documentStore.getAll()
        return records.map(Document.from)
    }

    static cleanTx = () => (tx: Tx) => {
        return tx.documentStore.clear()
    }

    static loadTx = (docs: IDocument[]) => docs.map(doc => (tx: Tx) => tx.documentStore.add(doc))

    static get = async(id: string) => {
        const db = await getLocalDb()
        const record = await db.get("documents", id)
        if(!record) 
            return null
        return new Document(record.name, record.type, record.id, record.createdAt)
    }

    static getTx = (id: string) => async (tx: Tx) => {
        const record = await tx.documentStore.get(id)
        if(!record) return null
        return new Document(
            record.name,
            record.type,
            record.id,
            record.createdAt
        )
    }

    addTx = (tx: Tx) => tx.documentStore.add(this.asPlain())

    updatetx = (tx: Tx) => tx.documentStore.put(this.asPlain())

    remove = async () => {
        const db = await getLocalDb()
        await db.delete('documents', this.id)
    }

    removeTx = async (tx: Tx) => {
        await tx.documentStore.delete(this.id)
    }

    static async clean(){
        const db = await getLocalDb()
        await db.clear("documents")
    }

    toCsvRow() {
        return `${this.id},"${this.name}",${this.type},${this.createdAt}`
    }

    static toCsvString(docs: Document[]){
        const rows = docs.map(doc => doc.toCsvRow())
        const csv = rows.join("\n")
        return csv
    }

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const docs = records.map(row => {
            const id = row[0]
            const name = row[1]
            const type = row[2] as IDocument['type']
            const createdAt = parseInt(row[3])
            return new Document(name, type, id, createdAt)
        })
        return docs
    }
} 