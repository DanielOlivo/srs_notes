import { v4 } from "uuid";
import type { Tx } from "../LocalDb";
import { 
    type Note ,
    basicNoteStoreName,
    textNoteStoreName,
    imageNoteStoreName,
} from "../entities/Note";
import type { IDBPDatabase } from "idb";
import type { Db } from "../Db";

export class NoteOps {
    tx: Tx | null = null

    static createStore(db: IDBPDatabase<Db>) {
        // const store = db.createObjectStore(storeName, {keyPath: "id"})
        const basicStore = db.createObjectStore(basicNoteStoreName, {keyPath: "id"})
        const textStore = db.createObjectStore(textNoteStoreName, {keyPath: "id"})
        const imageStore = db.createObjectStore(imageNoteStoreName, {keyPath: "id"})

        // store.createIndex("by-type", "type", {unique: false})
        return {
            basicStore,
            textStore,
            imageStore
        }
    }

    getById = (id: string) => async (tx: Tx) => {
        const [
            basic,
            text,
            image
        ] = await Promise.all([
            tx.basicNoteStore.get(id),
            tx.textNoteStore.get(id),
            tx.imageNoteStore.get(id)
        ])
        return basic ?? text ?? image
    }

    getBasicById = (id: string) => (tx: Tx) => {
        return tx.basicNoteStore.get(id)
    }

    getImageById = (id: string) => (tx: Tx) => {
        return tx.imageNoteStore.get(id)
    }

    getTextById = (id: string) => (tx: Tx) => {
        return tx.textNoteStore.get(id)
    }

    create = <T extends Note>(note: T) => (tx: Tx) => {
        // note.id = v4()
        note.createdAt = Date.now()
        note.updatedAt = Date.now()

        switch(note.kind){
            case "basic":
                return tx.basicNoteStore.add(note)
            case "text":
                return tx.textNoteStore.add(note)
            case "image":
                return tx.imageNoteStore.add(note)
            default: 
                throw new Error('unexpected')
        }
    }

    update = <T extends Note>(note: T) => (tx: Tx) => {
        note.updatedAt = Date.now()
        switch(note.kind){
            case "basic":
                return tx.basicNoteStore.put(note)
            case "text":
                return tx.textNoteStore.put(note)
            case "image":
                return tx.imageNoteStore.put(note)
            default: 
                throw new Error('unexpected')
        }
    }

    delete = (id: string, kind: Note['kind']) => (tx: Tx) => {
        switch(kind){
            case "basic":
                return tx.basicNoteStore.delete(id)
            case "text":
                return tx.textNoteStore.delete(id)
            case "image":
                return tx.imageNoteStore.delete(id)
            default:
                throw new Error('unexpected')
        } 
        //return tx.noteStore.delete(id)
    }
}