import type { IDBPDatabase } from "idb";
import { storeName, type IPosition } from "../entities/position"
import type { Db } from "../Db";
import type { IVector2 } from "../../utils/Vector2";
import type { Tx } from "../LocalDb";

export class PositionOps {

    tx: Tx | null = null

    static createStore(db: IDBPDatabase<Db>) {
        const store = db.createObjectStore(storeName, {keyPath: "id", autoIncrement: true})
        store.createIndex("by-coord", ["documentId", "coord.x", "coord.y"], {unique: true});
        store.createIndex("by-ids", ["noteId", "documentId"], {unique: true});
        store.createIndex("by-noteId", "noteId", {unique: false});
        store.createIndex("by-docId", "documentId", {unique: false});
        return store
    }

    getById = (id: number) => (tx: Tx) => {
        return tx.positionStore.get(id)
    }

    getAllByDocId = (id: string) => (tx: Tx) => {
        return tx.positionStore.index("by-docId").getAll(id)
    }

    getByCoord = (gridId: string, x: number, y: number) => (tx: Tx) => {
        return tx.positionStore.index("by-coord").get([gridId, x, y])
    }

    getbyNoteId = (noteId: string) => (tx: Tx) => {
        return tx.positionStore.index("by-noteId").get(noteId)
    }

    create = (noteId: string, documentId: string, coord: IVector2) => (tx: Tx) => {
        const position = {
            noteId,
            documentId,
            coord
        } as IPosition
        return tx.positionStore.add(position)
    }

    update = (position: IPosition) => (tx: Tx) => {
        return tx.positionStore.put(position)
    }

    delete = (id: number) => (tx: Tx) => {
        return tx.positionStore.delete(id)
    }
}