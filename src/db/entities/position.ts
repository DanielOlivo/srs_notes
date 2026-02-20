import { Vector2, type IVector2 } from "../../utils/Vector2"
import { parse } from 'papaparse'
import { getLocalDb, withTx, type Tx } from "../LocalDb"
import type { IDBPDatabase } from "idb"
import type { Db } from "../Db"

export interface IPosition {
    id: number
    noteId: string
    documentId: string
    coord: IVector2 // for list just use y
}

export const storeName = "positions"

export interface PositionDb {
    [storeName]: {
        key: number,
        value: IPosition
        indexes: {
            "by-coord": [string, number, number] // [docId, x, y]
            "by-noteId": string
            "by-ids": [string, string] // [noteId, docId]
            "by-docId": string
        }
    }
}

export class Position implements IPosition {
    id: number
    noteId: string
    documentId: string
    coord: Vector2

    constructor(id: number, noteId: string, documentId: string, coord: IVector2){
        this.id = id
        this.noteId = noteId
        this.documentId = documentId
        this.coord = Vector2.from(coord)
    }   

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
        store.createIndex("by-coord", ["documentId", "coord.x", "coord.y"], {unique: false});
        store.createIndex("by-ids", ["noteId", "documentId"], {unique: true});
        store.createIndex("by-noteId", "noteId", {unique: false});
        store.createIndex("by-docId", "documentId", {unique: false});
        return store
    }

    static deleteStore = (db: IDBPDatabase<Db>) => {
        db.deleteObjectStore(storeName)
    }

    static from = (pos: IPosition) => new Position(
        pos.id,
        pos.noteId,
        pos.documentId,
        pos.coord
    )

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll("positions")
        const positions = records.map(r => new Position(
            r.id,
            r.noteId,
            r.documentId,
            r.coord
        ))
        return positions
    }

    static cleanTx = () => (tx: Tx) => {
        return tx.positionStore.clear()
    }

    static loadTx = (positions: IPosition[]) => positions.map(pos => (tx: Tx) => tx.positionStore.add(pos))

    removeTx = (tx: Tx) => tx.positionStore.delete(this.id)

    static getByNoteIdTx = (noteId: string) => async (tx: Tx) => {
        const record = await tx.positionStore.index("by-noteId").get(noteId)
        if(!record)
            return null
        return new Position(
            record.id,
            record.noteId,
            record.documentId,
            record.coord
        )
    }

    static getByDocIdTx = (docId: string) => async (tx: Tx) => {
        const records = await tx.positionStore.index("by-docId").getAll(docId)
        const positions = records.map(r => new Position(
            r.id,
            r.noteId,
            r.documentId,
            r.coord
        ))
        return positions
    }

    addTx = async (tx: Tx) => {
        const {id: _, ...plain} = this.asPlain()
        try{
            const id = await tx.positionStore.add(plain as IPosition)
            this.id = id
        }
        catch(error){
            throw new Error(`Position ${this}; addTx failure: ${error}`)
        }
    }

    updateTx = async (tx: Tx) => {
        try{
            await tx.positionStore.put(this.asPlain())
        }
        catch(error){
            throw new Error(`Position ${this.toCsvRow()}; updateTx failure: ${error}`)
        }
    }

    asPlain = (): IPosition => ({
        id: this.id,
        noteId: this.noteId,
        documentId: this.documentId,
        coord: this.coord.asPlain()
    })

    toCsvRow = () => `${this.id},${this.noteId},${this.documentId},${this.coord.x},${this.coord.y}`

    static fromCsv(csv: string){
        const data = parse(csv)
        const records = data.data as string[][]
        const positions = records.map(row => {
            const [ id, noteId, documentId, xStr, yStr ] = row
            return new Position(
                parseInt(id),
                noteId,
                documentId,
                { x: parseInt(xStr), y: parseInt(yStr) }
            )
        })
        return positions
    }

}

export class Positions {

    positions: Position[]
    docId: string

    private constructor(docId: string, positions: IPosition[]){
        this.positions = positions.map(Position.from)
        this.docId = docId
    }

    static ofDoc = async (docId: string) => {
        const [positions] = await withTx( Position.getByDocIdTx(docId) )
        return new Positions(docId, positions)
    }

    static ofDocTx = (docId: string) =>  async (tx: Tx): Promise<Positions> => {
        const records = await tx.positionStore.index('by-docId').getAll(docId)
        return new Positions(docId, records)
    }

    /**
     * 
     * @param idx if missing, then to the end of the document
     */
    insertTx = (noteId: string, idx?: number): ((tx: Tx) => Promise<void>)[] => {
        const y = idx === undefined ? this.positions.length : idx - 0.5
        const coord = { x: 0, y }
        const newPosition = new Position(0, noteId, this.docId, coord)
        this.positions.push(newPosition)
        this.positions.sort((a, b) => a.coord.y - b.coord.y)

        this.positions.forEach((pos, i) => pos.coord.y = i)

        return [
            ...this.positions
            .filter(pos => pos.id !== newPosition.id)
            .map(pos => pos.updateTx),
            newPosition.addTx
        ]
    }
}