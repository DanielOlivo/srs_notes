import type { IVector2 } from "../../utils/Vector2"

export interface Position {
    id: number
    noteId: string
    documentId: string
    coord: IVector2 // for list just use y
}

export const storeName = "positions"

export interface PositionDb {
    [storeName]: {
        key: number,
        value: Position
        indexes: {
            "by-coord": [string, number, number] // [docId, x, y]
            "by-noteId": string
            "by-ids": [string, string] // [noteId, docId]
            "by-docId": string
        }
    }
}