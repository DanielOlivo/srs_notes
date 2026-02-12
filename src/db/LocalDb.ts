import { openDB, type IDBPDatabase } from "idb";
import type { Ease } from "../Game/Ease";
import type { IDocument } from "./entities/document";
import type { Db } from "./Db";
import { DocumentOps } from "./ops/document.ops";
import { PositionOps } from "./ops/position.ops";
import type { Note, NoteData } from "./entities/Note";
import { IntervalOps } from "./ops/interval.ops";
import { NoteOps } from "./ops/Note.ops";
import { AnswerOps } from "./ops/answer.ops";
import { storeName as intervalStoreName, type IInterval } from "./entities/interval";
import { basicNoteStoreName, imageNoteStoreName, textNoteStoreName } from "./entities/Note";
import { BasicNote, TextNote } from "./entities/Note.utils";
import { v4 } from "uuid";
import { NotImplemented } from "../utils/NotImplemented";
import { Vector2, type IVector2 } from "../utils/Vector2";
import { Document } from "./Document";
import { Position } from "./entities/position";
import { ScrollPosition } from "./entities/scrollPosition";

const dbName = "memoryGameDb";

const migrations = [
    (db: IDBPDatabase<Db>) => {
        DocumentOps.createStore(db)
        NoteOps.createStore(db)
        PositionOps.createStore(db)
        AnswerOps.createStore(db)
        IntervalOps.createStore(db)
    },

    (db: IDBPDatabase<Db>) => {
        ScrollPosition.createStore(db)
    }
]

export async function getLocalDb() {

    const latestVersion = migrations.length;

    return await openDB<Db>(dbName,latestVersion, {
        upgrade(db, oldVersion, newVersion){
            for(let i = oldVersion; i < (newVersion ?? 0); i++){
                migrations[i](db);
            }
        }
    })
}

export async function getDb(){
    const db = await getLocalDb();
    return new DbOps(db);
}

export function getTx(db: IDBPDatabase<Db>) {
    const tx = db.transaction([
        "documents", 
        // noteStoreName, 
        basicNoteStoreName,
        textNoteStoreName,
        imageNoteStoreName,
        "answers", 
        intervalStoreName, 
        "scrollPositions",
        "positions"], 
        "readwrite",
    )
    const documentStore = tx.objectStore("documents");
    // const noteStore = tx.objectStore(noteStoreName)
    const basicNoteStore = tx.objectStore(basicNoteStoreName)
    const textNoteStore = tx.objectStore(textNoteStoreName)
    const imageNoteStore = tx.objectStore(imageNoteStoreName)
    const answerStore = tx.objectStore("answers")
    const positionStore = tx.objectStore("positions")
    const intervalStore = tx.objectStore(intervalStoreName)
    const scrollPositionStore = tx.objectStore("scrollPositions")

    // to remove

    return {
        documentStore,
        positionStore,
        // noteStore,
        basicNoteStore,
        textNoteStore,
        imageNoteStore,
        answerStore,
        intervalStore,
        scrollPositionStore,
        tx
    }

}

export type Tx = ReturnType<typeof getTx>

export const withTx = async <T extends any[]>(...fns: { [K in keyof T]: ((tx: Tx) => Promise<T[K]>)} ) => {

    const db = await getLocalDb()
    const tx = getTx(db)

    const results = await Promise.all([
        ...fns.map(fn => fn(tx)),
        tx.tx.done
    ])

    return results.slice(0, -1) as T
}

class DbOps {

    private db: IDBPDatabase<Db>
    private positionOps: PositionOps
    private documentOps: DocumentOps
    private noteOps: NoteOps    
    private answerOps: AnswerOps
    private intervalOps: IntervalOps

    constructor(db: IDBPDatabase<Db>){
        this.db = db;
        this.positionOps = new PositionOps()
        this.documentOps = new DocumentOps()
        this.noteOps = new NoteOps()    
        this.answerOps = new AnswerOps()
        this.intervalOps = new IntervalOps()
    }
    
    setTx() {
        const tx = getTx(this.db)
        return tx
    }

    async withTx<T extends any[]>(...fns: { [K in keyof T]: ((tx: Tx) => Promise<T[K]>)} ) {

        // const tx = this.setTx()
        const tx = getTx(this.db)

        const results = await Promise.all([
            ...fns.map(fn => fn(tx)),
            tx.tx.done
        ])

        return results.slice(0, -1) as T
    }

    // documents
   async getDocumentList(): Promise<IDocument[]> {
        const [docs] = await this.withTx(
            this.documentOps.getAllDocuments()
        )
        return docs
    }

    async getDocumentById(id: string): Promise<IDocument | undefined>{
        try{
            const [doc] = await this.withTx(
                this.documentOps.getById(id)
            )
            return doc
        } catch(error){
            console.error(error)
            return undefined
        }
    }

    async getDocumentByName(name: string): Promise<IDocument | undefined>{
        return await this.db.getFromIndex("documents", "by-name", name);
    }

    async createDocument(document: IDocument){
        await this.withTx(
            this.documentOps.createDocument(document)
        )
    }

    async removeDocument(id: string): Promise<void> {
        await this.withTx(
            this.documentOps.deleteDocument(id)
        )
    }

    async updateDocumentName(id: string, name: string): Promise<void> {
        const [doc] = await this.withTx(this.documentOps.getById(id))
        if(!doc) throw new Error(`document with id ${id} not found`)
        await this.withTx(this.documentOps.updateName(doc, name))
    }
    
    async tryGetNoteById(id: string){
        const [ maybeNote ] = await this.withTx(this.noteOps.getById(id))
        return maybeNote 
    }

    async getNoteById(id: string) {
        const [ note ] = await this.withTx(this.noteOps.getById(id))
        // if(!note) throw new Error(`note with id ${id} not found`)
        return note
    }

    async getNotePositions(noteIds: string[]){
        const positions = await this.withTx(
            ...noteIds.map(noteId => this.positionOps.getbyNoteId(noteId))
        )
        return positions
    } 

    async getAllDocNotes(docId: string) {
        const [ positions ] = await this.withTx(
            this.positionOps.getAllByDocId(docId)
        )

        const notes = await this.withTx(
            ...positions.map(pos => this.noteOps.getById(pos.noteId))
        ) 
        return { notes, positions }
    }

    async createListNoteAtPos<T extends NoteData>(docId: string, data: T, coord: IVector2){
        const [doc, positions] = await withTx(
            Document.getTx(docId),
            Position.getByDocIdTx(docId)
        )

        if(!doc) throw new Error(`document with id ${docId} not found`)

        const id = v4()
        const createdAt = Date.now()
        const updatedAt = Date.now()
        const note = (() => {
            switch(data.kind){
                case "basic": return new BasicNote(id, createdAt, updatedAt, data.front, data.back)
                case "text": return new TextNote(id, createdAt, updatedAt, data.text)
                default: throw new NotImplemented()
            }
        })()
        const createNoteFn = (() => {
            switch(note.kind){
                case "basic": return note.addTx
                case 'text': return note.addTx
                default: throw new Error()
            }
        })()

        const newPos = new Position(0, note.id, docId, new Vector2(0, coord.y))

        for(const pos of positions){
            if(pos.coord.y >= coord.y)
                pos.coord = pos.coord.sum(new Vector2(0, 1))
        }
        positions.sort((a, b) => b.coord.y - a.coord.y)

        // console.log(
        //     "positions y updated", positions.map(p => p.coord.y),
        //     "new pos y", newPos.coord.y
        // )

        await withTx(
            createNoteFn,
            ...positions.map(pos => pos.updateTx),
            newPos.addTx
        )
    }

    async createListNote<T extends NoteData>(docId: string, data: T){
        const [doc] = await this.withTx(this.documentOps.getById(docId)) 
        if(!doc){
            throw new Error(`document with id ${docId} not found`)
        }

        const [ positions ] = await this.withTx(
            this.positionOps.getAllByDocId(docId)
        )

        const maxY = positions.length === 0 ? 0 : Math.max(...positions.map(pos => pos.coord.y))
        const coord = {
            x: 0,
            y: maxY + 1
        }

        const id = v4()
        const created = Date.now()
        const updated = Date.now()

        const note = (() => {
            switch(data.kind){
                case 'basic': return new BasicNote(id, created, updated, data.front, data.back)
                case 'text': return new TextNote(id, created, updated, data.text)
                default: throw new NotImplemented()
            }
        })()

        await this.withTx(
            this.noteOps.create(note),
            this.positionOps.create(note.id, docId, coord)
        )
    }

    async updateNote<T extends Note>(note: T): Promise<void> {
        switch(note.kind){
            case "basic": await BasicNote.from(note).update(); break;
            case "text": await TextNote.from(note).update(); break;
        }
    }

    async deleteNote(noteId: string, kind: Note['kind']){
        const [ position ] = await this.withTx(
            this.positionOps.getbyNoteId(noteId)
        )

        if(!position) throw new Error(`note with id ${noteId} not found`)

        await this.withTx(
            this.noteOps.delete(noteId, kind),
            this.positionOps.delete(position.id)
        )
    }

    async deletePosition(positionId: number){
        await this.withTx(
            this.positionOps.delete(positionId)
        )
    }

    async addInterval(interval: IInterval){
        await this.withTx(
            this.intervalOps.create(interval.noteId, interval.openDuration)
        )
    }

    async getIntervalByNoteId(noteId: string){
        const [interval] = await this.withTx(
            this.intervalOps.getByNoteId(noteId)
        )
        return interval
    }

    async removeInterval(intervalId: string){
        await this.withTx(
            this.intervalOps.delete(intervalId)
        )
    }

    async updateNoteInterval(noteId: string, openDuration: number, openTimestamp: number){
        const interval = await this.getIntervalByNoteId(noteId)
        if(interval){
            await this.withTx(
                this.intervalOps.update(interval, openDuration, openTimestamp)
            )
        }
    }

    async answer(noteId: string, answer: Ease, nextInterval: number){
        const [ currentInterval ] = await this.withTx(
            this.intervalOps.getByNoteId(noteId)
        )

        await this.withTx(
            this.answerOps.create(noteId, answer),
            this.intervalOps.create(noteId, nextInterval),
            currentInterval ? this.intervalOps.delete(currentInterval.id) : (_: Tx) => Promise.resolve()
        )
    }

    async clear(){
        await Promise.all(
            [...this.db.objectStoreNames]
            .map(name => this.db.clear(name))
        )
    }
}