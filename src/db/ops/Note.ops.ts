import { v4 } from "uuid";
import type { Tx } from "../LocalDb";
import { storeName, type Note } from "../entities/Note";
import type { IDBPDatabase } from "idb";
import type { Db } from "../Db";

export class NoteOps {
    tx: Tx | null = null

    static createStore(db: IDBPDatabase<Db>) {
        const store = db.createObjectStore(storeName, {keyPath: "id"})
        store.createIndex("by-type", "type", {unique: false})
        return store
    }

    getById = (id: string) => (tx: Tx) => {
        return tx.noteStore.get(id)
    }

    create = <T extends Note>(note: T) => (tx: Tx) => {

        const id = v4()
        const createdAt = Date.now()
        const updatedAt = Date.now()

        const toCreate = {
            ...note,
            id,
            createdAt,
            updatedAt
        }

        return tx.noteStore.add(toCreate)
    }

    update = <T extends Note>(note: T) => (tx: Tx) => {
        return tx.noteStore.put(note)
    }

    delete = (id: string) => (tx: Tx) => {
        return tx.noteStore.delete(id)
    }
}