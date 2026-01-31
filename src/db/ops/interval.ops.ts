import type { IDBPDatabase } from "idb";
import type { Tx } from "../LocalDb";
import type { Db } from "../Db";
import type { IInterval } from "../entities/interval";

export class IntervalOps {
    tx: Tx | null = null

    static createStore(db: IDBPDatabase<Db>){
        const store = db.createObjectStore("intervals", {keyPath: "id"})
        store.createIndex("by-noteId", "noteId", {unique: false})
        return store
    } 

    getById = (id: string) => (tx: Tx) => {
        return tx.intervalStore.get(id)
    }

    getByNoteId = (noteId: string) => (tx: Tx) => {
        return tx.intervalStore.index("by-noteId").get(noteId)
    }

    update = (interval: IInterval, openDuration: number, openTimestamp: number) => (tx: Tx) => {
        return tx.intervalStore.put({...interval, openDuration, openTimestamp})
    }

    create = (noteId: string, openDuration: number) => (tx: Tx) => {
        const openTimestamp = Date.now()
        const interval: IInterval = {
            id: noteId,
            noteId,
            openTimestamp,
            openDuration
        }
        return tx.intervalStore.add(interval)
    }

    delete = (id: string) => (tx: Tx) => {
        return tx.intervalStore.delete(id)
    }
}