import type { IDBPDatabase } from "idb"
import { getLocalDb, type Tx } from "../LocalDb"
import type { Db } from "../Db"

export interface IScrollPosition {
    id: string // doc id
    // noteId: string // note id
    idx: number
}

export interface ScrollPositionDb {
    scrollPositions: {
        key: string
        value: IScrollPosition
    }
}

export class ScrollPosition {
    id: string
    // noteId: string
    idx: number

    constructor(id: string, idx: number/*noteId: string*/){
        this.id = id
        // this.noteId = noteId
        this.idx = idx
    }

    static from = (pos: IScrollPosition) => new ScrollPosition(
        pos.id,
        // pos.noteId
        pos.idx
    )

    static createStore = (db: IDBPDatabase<Db>) => {
        const scrollPositionStore = db.createObjectStore("scrollPositions", {keyPath: "id"})
        return { scrollPositionStore }
    }

    asPlain(): IScrollPosition {
        return {
            id: this.id,
            // noteId: this.noteId
            idx: this.idx
        }
    } 

    toCsvRow = () => `${this.id},${this.idx}`  

    static all = async () => {
        try{
            const db = await getLocalDb()
            const records = await db.getAll("scrollPositions")
            const pos = records.map(ScrollPosition.from)
            return pos
        }
        catch(error){
            throw new Error(`Failed to get all scroll positions: ${error}`)
        }
    }

    static allTx = async(tx: Tx) => {
        try{
            const records = await tx.scrollPositionStore.getAll("scrollPositions")
            const pos = records.map(ScrollPosition.from)
            return pos
        }
        catch(error){
            throw new Error(`Scroll positions allTx failure: ${error}`)
        }
    }

    static get = async (docId: string) => {
        try{
            const db = await getLocalDb()
            const record = await db.get("scrollPositions", docId)
            return record ? ScrollPosition.from(record) : null
        }
        catch(error){
            throw new Error(`Failed to get scroll position for ${docId}: ${error}`)
        }
    }

    update = async () => {
        try{
            const db = await getLocalDb()
            await db.put("scrollPositions", this.asPlain())
        }
        catch(error){
            throw new Error(`Failed to update scroll position: ${error}`)
        }
    }

    updateTx = async (tx: Tx) => {
        try{
            const plain = this.asPlain()
            await tx.scrollPositionStore.put(plain)
        }
        catch(error){
            throw new Error(`Failed to update scroll position: ${error}`)
        }
    }
}
