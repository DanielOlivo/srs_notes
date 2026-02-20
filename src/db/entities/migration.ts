import type { IDBPDatabase } from "idb"
import type { Db } from "../Db"
import { Document } from "../Document"
import { BasicNote, ImageNote, Interval, TextNote } from "./Note.utils"
import { Position } from "./position"
import { Answer } from "./answer"
import { ScrollPosition } from "./scrollPosition"
import { DeletedDoc } from "./deletedDoc"
import { DeletedNote } from "./deletedNote"

type MigrationFn = (db: IDBPDatabase<Db>) => void

export const migrations: MigrationFn[] = [
    (db) => {
        Document.createStore(db)
        BasicNote.createStore(db)
        TextNote.createStore(db)
        ImageNote.createStore(db)

        Position.createStore(db)

        Answer.createStore(db)

        Interval.createStore(db)
    },

    (db) => {
        ScrollPosition.createStore(db)
    },

    (db) => {
        DeletedDoc.createStore(db)
    },

    (db) => {
        DeletedNote.createStore(db)
    },
    
    (db) => {
        Position.deleteStore(db)
        Position.createStore(db)
    }
]