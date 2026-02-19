import { openDB, type IDBPDatabase } from "idb";
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
import { BaseNote, BasicNote, ImageNote, Interval, TextNote } from "./entities/Note.utils";
import { v4 } from "uuid";
import { NotImplemented } from "../utils/NotImplemented";
import { Vector2, type IVector2 } from "../utils/Vector2";
import { Document } from "./Document";
import { Position } from "./entities/position";
import { ScrollPosition } from "./entities/scrollPosition";
import { DeletedDoc, storeName as deletedDocStoreName } from "./entities/deletedDoc"
import { DeletedNote, storeName as deletedNoteStoreName } from "./entities/deletedNote";
import { Answer, type Ease } from "./entities/answer";
import { getNextInterval } from "../notes/updateInterval";
import type { Data } from "./csv";
// import { ImageNote } from "./entities/ImageNote";

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
    },

    (db: IDBPDatabase<Db>) => {
        DeletedDoc.createStore(db)
    },

    (db: IDBPDatabase<Db>) => {
        DeletedNote.createStore(db)
    },

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
        deletedDocStoreName,
        deletedNoteStoreName,
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
    const deletedDocStore = tx.objectStore(deletedDocStoreName)
    const deletedNoteStore = tx.objectStore(deletedNoteStoreName)

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
        deletedDocStore,
        deletedNoteStore,
        tx
    }

}

export type Tx = ReturnType<typeof getTx>

export const withTx = async <T extends unknown[]>(...fns: { [K in keyof T]: ((tx: Tx) => Promise<T[K]>)} ) => {

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
    private noteOps: NoteOps    
    private intervalOps: IntervalOps

    constructor(db: IDBPDatabase<Db>){
        this.db = db;
        this.positionOps = new PositionOps()
        this.noteOps = new NoteOps()    
        this.intervalOps = new IntervalOps()
    }
    
    setTx() {
        const tx = getTx(this.db)
        return tx
    }

    async withTx<T extends unknown[]>(...fns: { [K in keyof T]: ((tx: Tx) => Promise<T[K]>)} ) {

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
        const [docs, deleted] = await withTx(
            Document.allTx,
            DeletedDoc.allTx
        ) 
        const excluded = new Set(deleted.map(d => d.id))

        return docs.filter(doc => !excluded.has(doc.id)).map(doc => doc.asPlain())
    }

    async getDocumentById(id: string): Promise<IDocument | undefined>{
        const doc = await Document.get(id)
        return doc?.asPlain()
    }

    async getDocumentByName(name: string): Promise<IDocument | undefined>{
        return await this.db.getFromIndex("documents", "by-name", name);
    }

    async createDocument(name: string, type: Document["type"]): Promise<string> {
        const doc = new Document(name, type, v4(), Date.now())
        await withTx(
            doc.addTx
        )
        return doc.id
    }

    async removeDocument(id: string): Promise<void> {
        const deleted = new DeletedDoc(id, Date.now())
        await withTx(deleted.addTx)
    }

    async updateDocumentName(id: string, name: string): Promise<void> {
        const doc = await Document.get(id)
        if(!doc) throw new Error(`document with id ${id} not found`)
        doc.name = name
        await withTx(doc.updatetx)
    }

    getScrollPosition = async (docId: string) => {
        const pos = await ScrollPosition.get(docId)
        return pos?.noteId
    }

    setScrollPosition = async(docId: string, noteId: string) => {
        const pos = new ScrollPosition(docId, noteId)
        await withTx(pos.updateTx)
    }
    
    async tryGetNoteById(id: string){
        const [ maybeNote ] = await this.withTx(this.noteOps.getById(id))
        return maybeNote 
    }

    async getNoteById(id: string) {
        const [ note ] = await withTx(BaseNote.getTx(id))
        return note
    }

    async getNotePositions(noteIds: string[]){
        const positions = await this.withTx(
            ...noteIds.map(noteId => this.positionOps.getbyNoteId(noteId))
        )
        return positions
    } 

    async getDocNotes(docId: string) {
        try{
            const [ positions, deleted ] = await withTx(
                Position.getByDocIdTx(docId),
                DeletedNote.allTx
            )
            const excluded = new Set(deleted.map(d => d.id))
            positions.sort((a, b) => a.coord.y - b.coord.y)

            // const doesHave = positions.some(pos => excluded.has(pos.noteId))

            const notes = (await withTx(
                ...positions
                .filter(pos => !excluded.has(pos.noteId))
                .map(pos => BaseNote.getTx(pos.noteId))
            )).filter(note => note !== null)
            return notes.map(note => note.asPlain())
        }
        catch(error){
            throw new Error(`LocalDb.getDocNotes failure: ${error}`)
        }
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
                case "image": return new ImageNote(id, createdAt, updatedAt, data.name, data.data)
                default: throw new NotImplemented()
            }
        })()
        const createNoteFn = (() => {
            switch(note.kind){
                case "basic": return note.addTx
                case 'text': return note.addTx
                case 'image': return note.addTx
                default: throw new Error()
            }
        })()

        const newPos = new Position(0, note.id, docId, new Vector2(0, coord.y))

        for(const pos of positions){
            if(pos.coord.y >= coord.y)
                pos.coord = pos.coord.sum(new Vector2(0, 1))
        }
        positions.sort((a, b) => b.coord.y - a.coord.y)

        await withTx(
            createNoteFn,
            ...positions.map(pos => pos.updateTx),
            newPos.addTx
        )
    }

    // should be one
    async createListNote<T extends NoteData>(docId: string, data: T){
        const [doc, positions] = await withTx(
            Document.getTx(docId),
            Position.getByDocIdTx(docId)
        ) 

        if(!doc){
            throw new Error(`document with id ${docId} not found`)
        }

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
                case 'image': return new ImageNote(id, created, updated, data.name, data.data)
                default: throw new NotImplemented()
            }
        })()

        const position = new Position(0, id, docId, coord)

        const createIntervalOption = (() => {
            switch(data.kind){
                case 'basic': { return (new Interval(v4(), id, 30000, Date.now())).addTx }; 
                default: return (async () => {})
            }
        })()

        await withTx(
            note.addTx,
            position.addTx,
            createIntervalOption
        )
    }

    async updateNote<T extends Note>(note: T): Promise<void> {
        switch(note.kind){
            case "basic": await BasicNote.from(note).update(); break;
            case "text": await TextNote.from(note).update(); break;
        }
    }

    async deleteNote(noteId: string){
        const record = new DeletedNote(noteId, Date.now())

        await this.withTx(
            record.addTx
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
        const [interval] = await withTx(
            Interval.getByNoteIdTx(noteId)
        )
        return interval?.asPlain()
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

    async answer(noteId: string, ease: Ease){
        try{
            const answer = new Answer(v4(), noteId, ease, Date.now())
            const interval = await Interval.getByNoteId(noteId)
            const updateInterval = (() => {
                if(interval){
                    const nextInterval = getNextInterval(interval, ease)
                    return interval.updateTx(nextInterval)
                }
                const toCreate = new Interval(v4(), noteId, 30000, Date.now())
                return toCreate.addTx
            })()

            await withTx(
                answer.addTx,
                updateInterval
            )

        }
        catch(error){
            throw new Error(`LocalDb.answer failure: ${error}`)
        }
    }

    uploadBackup = async (data: Data) => {
        const docFns = data.docs.map(Document.from).map(doc => doc.addTx)
        const basicNoteFns = data.basicNotes.map(BasicNote.from).map(note => note.addTx)
        const textNoteFns = data.textNotes.map(TextNote.from).map(note => note.addTx)
        const positionFns = data.positions.map(Position.from).map(pos => pos.addTx)
        const intervalFns = data.intervals.map(Interval.from).map(int => int.addTx)
        const deletedDocFns = data.deletedDocs.map(DeletedDoc.from).map(ddoc => ddoc.addTx)
        const answerFns = data.answers.map(Answer.from).map(answer => answer.addTx)
        

        await withTx(
            ...docFns,
            ...basicNoteFns,
            ...textNoteFns,

            ...positionFns,
            ...deletedDocFns,

            ...answerFns,
            ...intervalFns,
        )
    }

    async clear(){
        await Promise.all(
            [...this.db.objectStoreNames]
            .map(name => this.db.clear(name))
        )
    }
}