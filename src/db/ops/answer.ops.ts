import type { IDBPDatabase } from "idb";
import { storeName, type IAnswer } from "../entities/answer";
import type { Db } from "../Db";
import type { Tx } from "../LocalDb";
import type { Ease } from "../../Game/Ease";
import { v4 } from "uuid";

export class AnswerOps {
    tx: Tx | null = null

    static createStore(db: IDBPDatabase<Db>){
        const store = db.createObjectStore(storeName, {keyPath: "id"})
        store.createIndex("by-noteId", "noteId", {unique: false})
        return store
    }

    getById = (id: string) => (tx: Tx) => {
        return tx.answerStore.get(id)
    }

    getByNoteId = (noteId: string) => (tx: Tx) => {
        return tx.answerStore.index("by-noteId").getAll(noteId)
    }

    create = (noteId: string, ease: Ease) => (tx: Tx) => {
        const answer: IAnswer = {
            id: v4(),
            noteId,
            answer: ease,
            timestamp: Date.now()
        }

        return tx.answerStore.add(answer)
    }

    delete = (id: string) => (tx: Tx) => {
        return tx.answerStore.delete(id)
    }
}