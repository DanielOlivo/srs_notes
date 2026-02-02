import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import type { IDocument } from "./entities/document";
import { v4 } from "uuid";
import { getLocalDb } from "./LocalDb";
import { parse } from 'papaparse'

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

    asPlain(): IDocument {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            createdAt: this.createdAt
        }
    }

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