import type { IVector2 } from "../../utils/Vector2"
import { parse } from 'papaparse'
import { getLocalDb, type Tx } from "../LocalDb"

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
    coord: IVector2

    constructor(id: number, noteId: string, documentId: string, coord: IVector2){
        this.id = id
        this.noteId = noteId
        this.documentId = documentId
        this.coord = coord
    }   

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

    asPlain = (): IPosition => ({
        id: this.id,
        noteId: this.noteId,
        documentId: this.documentId,
        coord: this.coord
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