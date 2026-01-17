import type { IDBPDatabase } from "idb"
import type { Db } from "../Db"
import type { Document } from "../entities/document"
import type { Tx } from "../LocalDb"

const storeName = "documents"

export class DocumentOps {

    tx: Tx | null = null


    static createStore(db: IDBPDatabase<Db>) {
        const store = db.createObjectStore(storeName, {keyPath: "id"})
        store.createIndex("by-name", "name", {unique: false})
        return store
    }

    getAllDocuments = () => (tx: Tx) => {
        return tx.documentStore.getAll(storeName)
    }

    getById = (id: string) => (tx: Tx) => {
        return tx.documentStore.get(id)
    }

    getByName = (name: string) => (tx: Tx) => {
        return tx.documentStore.index("by-name").get(name)
    }

    createDocument = (document: Document) => (tx: Tx) => {
        const doc: Document = {
            ...document,
            createdAt: Date.now()
        }
        return tx.documentStore.add(doc)
    }

    deleteDocument = (id: string) => (tx: Tx) => {
        return tx.documentStore.delete(id)
    }

    updateName = (doc: Document, name: string) => (tx: Tx) => {
        return tx.documentStore.put(doc, name)
    }
}