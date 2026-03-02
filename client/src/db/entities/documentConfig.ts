import { parse } from "papaparse"
import { type IDocId, DocId } from "../../documents/document.defs"
import type { IDBPDatabase } from "idb"
import type { Db } from "../Db"
import { getLocalDb } from "../LocalDb"

export interface IDocumentConfig {
    docId: IDocId

    defaultInterval: number

    multiplicatorOnClosed: {
        hard: number
        good: number
        easy: number
    }

    multiplicatorOnOpen: {
        hard: number
        good: number
        easy: number
    }
}

export const storeName = "documentConfigs"
const defaultInterval = 30000 // 30 seconds

export interface DocumentConfigDb {
    [storeName]: {
        key: string
        value: IDocumentConfig
    }
}

export class DocumentConfig implements IDocumentConfig {

    docId: IDocId

    defaultInterval: number

    multiplicatorOnClosed: {
        hard: number
        good: number
        easy: number
    }

    multiplicatorOnOpen: {
        hard: number
        good: number
        easy: number
    }

    constructor(config: IDocumentConfig){
        this.docId = config.docId
        this.defaultInterval = config.defaultInterval
        this.multiplicatorOnClosed = config.multiplicatorOnClosed
        this.multiplicatorOnOpen = config.multiplicatorOnOpen
    }

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(storeName, {keyPath: "docId"})
        return store
    }

    static default = (docId: IDocId) => new DocumentConfig({
        docId,
        defaultInterval,
        multiplicatorOnClosed: {
            hard: 0.9,
            good: 1.1,
            easy: 1.2
        },
        multiplicatorOnOpen: {
            hard: 0.99,
            good: 1.01,
            easy: 1.02
        }
    })

    static get = async (id: IDocId) => {
        const db = await getLocalDb()
        const record = await db.get("documentConfigs", id)
        return record ? new DocumentConfig(record) : null
    }

    add = async () => {
        const db = await getLocalDb()
        await db.add("documentConfigs", this.asPlain())
    }

    asPlain = (): IDocumentConfig => ({
        docId: this.docId,
        defaultInterval: this.defaultInterval,
        multiplicatorOnClosed: this.multiplicatorOnClosed,
        multiplicatorOnOpen: this.multiplicatorOnOpen
    })

    toCsvRow = () => {
        const docIdAndInterval = `${this.docId},${this.defaultInterval}`
        const onOpen = (() => {
            const { hard, good, easy } = this.multiplicatorOnOpen
            return `${hard},${good},${easy}`
        })()
        const onClose = (() => {
            const { hard, good, easy } = this.multiplicatorOnClosed
            return `${hard},${good},${easy}`
        })()
        return `${docIdAndInterval},${onOpen},${onClose}`
    }

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const configs = records.map(row => {
            const [
                docId,
                defaultIntervalStr,
                onOpenHard,
                onOpenGood,
                onOpenEasy,
                onCloseHard,
                onCloseGood,
                onCloseEasy
            ] = row
            return new DocumentConfig({
                docId: DocId.create(docId),
                defaultInterval: parseInt(defaultIntervalStr),
                multiplicatorOnOpen: {
                    hard: parseFloat(onOpenHard),
                    good: parseFloat(onOpenGood),
                    easy: parseFloat(onOpenEasy),
                },
                multiplicatorOnClosed: {
                    hard: parseFloat(onCloseHard),
                    good: parseFloat(onCloseGood),
                    easy: parseFloat(onCloseEasy),
                }
            })
        })
        return configs
    }
}