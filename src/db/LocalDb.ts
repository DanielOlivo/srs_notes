import { openDB, type IDBPDatabase } from "idb";
import type { IDocument } from "./entities/document";
import type { Db } from "./Db";
import type { Note, NoteData } from "./entities/Note";
import { storeName as intervalStoreName } from "./entities/interval";
import { basicNoteStoreName, imageNoteStoreName, textNoteStoreName } from "./entities/Note";
import { BaseNote, BasicNote, ImageNote, Interval, TextNote } from "./entities/Note.utils";
import { v4 } from "uuid";
import { NotImplemented } from "../utils/NotImplemented";
import { type IVector2 } from "../utils/Vector2";
import { Document } from "./Document";
import { Position, Positions } from "./entities/position";
import { ScrollPosition } from "./entities/scrollPosition";
import { DeletedDoc, storeName as deletedDocStoreName } from "./entities/deletedDoc"
import { DeletedNote, storeName as deletedNoteStoreName } from "./entities/deletedNote";
import { Answer, type Ease } from "./entities/answer";
import { getNextInterval } from "../notes/updateInterval";
import type { Data } from "./csv";
import { migrations } from "./entities/migration";
import type { IDocId } from "../documents/document.defs";
import { DocumentConfig } from "./entities/documentConfig";
import { ClozeNote, clozeNoteStoreName } from "./entities/cloze";

const dbName = "memoryGameDb";

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
        clozeNoteStoreName,
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
    const clozeNoteStore = tx.objectStore(clozeNoteStoreName)
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
        clozeNoteStore,
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

    constructor(db: IDBPDatabase<Db>){
        this.db = db;
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

    getTrashedDocuments = async () => {
        const [docs, deleted] = await withTx(
            Document.allTx,
            DeletedDoc.allTx 
        )
        const set = new Set(deleted.map(d => d.id))
        return docs
            .filter(doc => set.has(doc.id))
            .map(Document.from)
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

    restoreDocument = async (id: IDocId): Promise<void> => {
        const deleted = await DeletedDoc.get(id)
        if(!deleted) throw new Error(`document with id ${id} not found`)
        await deleted.remove()
    }

    async updateDocumentName(id: string, name: string): Promise<void> {
        const doc = await Document.get(id)
        if(!doc) throw new Error(`document with id ${id} not found`)
        doc.name = name
        await withTx(doc.updatetx)
    }

    getDocumentConfig = async (id: IDocId) => {
        const config = await DocumentConfig.get(id)
        if(!config){
            const newConfig = DocumentConfig.default(id)
            await newConfig.add()
            return newConfig
        }
        return config
    }

    getScrollPosition = async (docId: string) => {
        const pos = await ScrollPosition.get(docId)
        return pos?.idx
    }

    setScrollPosition = async(docId: string, idx: number) => {
        const pos = new ScrollPosition(docId, idx)
        await withTx(pos.updateTx)
    }

    async getNoteById(id: string) {
        // const [ note ] = await withTx(BaseNote.getTx(id))
        const [basic, text, image, cloze] = await withTx(
            BasicNote.getTx(id),
            TextNote.getTx(id),
            ImageNote.getTx(id),
            ClozeNote.getTx(id)
        )
        return basic ?? text ?? image ?? cloze
    }

    getNoteByIdTx = (id: string) => async (tx: Tx) => {
        const [basic, text, image, cloze] = await Promise.all([
            BasicNote.getTx(id)(tx),
            TextNote.getTx(id)(tx),
            ImageNote.getTx(id)(tx),
            ClozeNote.getTx(id)(tx)
        ])
        return basic ?? text ?? image ?? cloze
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
                // .map(pos => BaseNote.getTx(pos.noteId))
                .map(pos => this.getNoteByIdTx(pos.noteId))
            )).filter(note => note !== null)
            return notes.map(note => note.asPlain())
        }
        catch(error){
            throw new Error(`LocalDb.getDocNotes failure: ${error}`)
        }
    }

    // should be one
    async createListNote<T extends NoteData>(docId: string, data: T, coord?: IVector2){
        const [doc, positions] = await withTx(
            Document.getTx(docId),
            // Position.getByDocIdTx(docId)
            Positions.ofDocTx(docId)
        ) 

        if(!doc){
            throw new Error(`document with id ${docId} not found`)
        }


        const id = v4()
        const created = Date.now()
        const updated = Date.now()

        const note = (() => {
            switch(data.kind){
                case 'basic': return new BasicNote(id, created, updated, data.front, data.back)
                case 'text': return new TextNote(id, created, updated, data.text)
                case 'image': return new ImageNote(id, created, updated, data.name, data.data)
                case 'cloze': return new ClozeNote(id, created, updated, data.text) 
                default: throw new NotImplemented()
            }
        })()

        const insertPositionFn = positions.insertTx(note.id, coord?.y)

        const createIntervalOption = (() => {
            switch(data.kind){
                case 'basic': case 'cloze': { return (new Interval(v4(), id, 30000, Date.now())).addTx }; 
                default: return (async () => {})
            }
        })()

        await withTx(
            note.addTx,
            ...insertPositionFn,
            createIntervalOption
        )
    }

    async updateNote<T extends Note>(note: T): Promise<void> {
        switch(note.kind){
            case "basic": await BasicNote.from(note).update(); break;
            case "text": await TextNote.from(note).update(); break;
            case 'cloze': await ClozeNote.from(note).update(); break;
        }
    }

    async deleteNote(noteId: string){
        const record = new DeletedNote(noteId, Date.now())

        await this.withTx(
            record.addTx
        )
    }

    async getIntervalByNoteId(noteId: string){
        const [interval] = await withTx(
            Interval.getByNoteIdTx(noteId)
        )
        return interval?.asPlain()
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
        const clozeFns = data.cloze.map(ClozeNote.from).map(note => note.addTx)
        

        await withTx(
            ...docFns,
            ...basicNoteFns,
            ...textNoteFns,
            ...clozeFns,

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