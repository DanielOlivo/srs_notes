import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Ease } from "../Game/Ease";
import { type Coord } from "../utils/Coord";
import { v4 } from "uuid";
import type { DocumentDto, DocumentInfoDto, DocumentListDto } from "../documents/document.dto";
import type { BasicNoteDto } from "../notes/notes.dto";
import { documentMappers } from "../utils/mappers/documentMappers";
import { getHash } from "./hasher";
import { noteMappers } from "../utils/mappers/noteMappers";

const dbName = "memoryGameDb";

export interface Document {
    hash: string // used as id
    name: string
    uploadedAt: Date 
    data: Blob
}

export interface Note {
    id: string
    front: string
    back: string
    createdAt: number
    updatedAt: number
}

export interface Grid {
    id: string
    name: string
    createdAt: number
}

export interface Position {
    id: number
    noteId: string
    gridId: string
    coord: Coord
}

export interface Answer {
    id: string
    noteId: string
    gridId: string
    answer: Ease
    timestamp: number
}

export interface GridNoteConfig {
    id: string
    noteId: string
    gridId: string
    currentOpenInterval: number
    lastOpenTimestamp: number
}


export interface MemoryGameDb extends DBSchema {

    documents: {
        key: string, // hash
        value: Document,
        indexes: {
            "by-name": string
        },
    },

    notes: {
        key: string
        value: Note
        indexes: {
            "by-front": string
            "by-back": string
            "by-createdAt": number
        }
    },

    grids: {
        key: string,
        value: Grid,
        indexes: {
            "by-name": string,
            "by-createdAt": number
        }
    },

    positions: {
        key: number,
        value: Position
        indexes: {
            "by-coord": [string, number, number] // [gridId, x, y]
            "by-noteId": string
            "by-ids": [string, string] // [noteId, gridId]
        }
    },

    answers: {
        key: string,
        value: Answer
        indexes: {
            "by-noteId": string,
        }
    },

    gridNoteConfigs: {
        key: [string, string] // [gridId, noteId]
        value: GridNoteConfig
        indexes: {
            "by-noteId": string
            "by-gridId": string
        }
    }
}

const migrations = [
    (db: IDBPDatabase<MemoryGameDb>) => {
        const documentStore = db.createObjectStore("documents", {keyPath: "hash"});
        documentStore.createIndex("by-name", "name", {unique: false});

        const noteStore = db.createObjectStore("notes", {keyPath: "id"})
        noteStore.createIndex("by-front", "front", {unique: false});
        noteStore.createIndex("by-back", "back", {unique: false});

        const gridStore = db.createObjectStore("grids", {keyPath: "id"});
        gridStore.createIndex("by-name", "name", {unique: false});
        gridStore.createIndex("by-createdAt", "createdAt", {unique: false});

        const positionStore = db.createObjectStore("positions", {keyPath: "id", autoIncrement: true});
        positionStore.createIndex("by-coord", ["gridId", "coord.x", "coord.y"], {unique: false});
        positionStore.createIndex("by-ids", ["noteId", "gridId"], {unique: false});

        const answerStore = db.createObjectStore("answers", {keyPath: "id"});
        answerStore.createIndex("by-noteId", "noteId", {unique: false});

        const gridNoteConfigStore = db.createObjectStore("gridNoteConfigs", {keyPath: ["gridId", "noteId"]});
        gridNoteConfigStore.createIndex("by-noteId", "noteId", {unique: false});
        gridNoteConfigStore.createIndex("by-gridId", "gridId", {unique: false});
    }
]

export async function getLocalDb() {

    const latestVersion = migrations.length;

    return await openDB<MemoryGameDb>(dbName,latestVersion, {
        upgrade(db, oldVersion, newVersion){
            for(let i = oldVersion; i < (newVersion ?? 0); i++){
                migrations[i](db);
            }
        }
    })

    // return await openDB<MemoryGameDb>(dbName, 1, {
    //     upgrade(db){
    //         const documentStore = db.createObjectStore("documents", {keyPath: "hash"});
    //         documentStore.createIndex("by-name", "name", {unique: false});

    //         const noteStore = db.createObjectStore("notes", {keyPath: "id"})
    //         noteStore.createIndex("by-front", "front", {unique: false});
    //         noteStore.createIndex("by-back", "back", {unique: false});

    //         const gridStore = db.createObjectStore("grids", {keyPath: "id"});
    //         gridStore.createIndex("by-name", "name", {unique: false});
    //         gridStore.createIndex("by-createdAt", "createdAt", {unique: false});

    //         const positionStore = db.createObjectStore("positions", {keyPath: "id", autoIncrement: true});
    //         positionStore.createIndex("by-coord", ["gridId", "coord.x", "coord.y"], {unique: false});
    //         positionStore.createIndex("by-ids", ["noteId", "gridId"], {unique: false});

    //         const answerStore = db.createObjectStore("answers", {keyPath: "id"});
    //         answerStore.createIndex("by-noteId", "noteId", {unique: false});

    //         const gridNoteConfigStore = db.createObjectStore("gridNoteConfigs", {keyPath: ["gridId", "noteId"]});
    //         gridNoteConfigStore.createIndex("by-noteId", "noteId", {unique: false});
    //         gridNoteConfigStore.createIndex("by-gridId", "gridId", {unique: false});

    //     }
    // })
}

export async function getDb(){
    const db = await getLocalDb();
    return new Db(db);
}


class Db {

    private db: IDBPDatabase<MemoryGameDb>

    constructor(db: IDBPDatabase<MemoryGameDb>){
        this.db = db;
    }
    
    private getTx(){
        const tx = this.db.transaction(["documents", "notes", "grids", "answers", "positions", "gridNoteConfigs"], "readwrite")
        const documentStore = tx.objectStore("documents");
        const noteStore = tx.objectStore("notes"); 
        const gridStore = tx.objectStore("grids");
        const positionStore = tx.objectStore("positions");
        const answerStore = tx.objectStore("answers");
        const gridNoteConfigStore = tx.objectStore("gridNoteConfigs");

        return {
            documentStore,
            noteStore,
            gridStore,
            positionStore,
            answerStore,
            gridNoteConfigStore,
            tx
        }
    }

    // documents
    async getDocumentList(): Promise<DocumentListDto> {
        const documents = await this.db.getAll("documents");
        return { documents: documents.map(doc => documentMappers.documentToDocumentInfoDto(doc)) }
    }

    async getDocumnet(hash: string): Promise<DocumentDto | null> {
        const document = await this.db.get("documents", hash);
        if(!document) return null;
        return documentMappers.documentToDocumentDto(document);
    }

    async getDocumentByName(name: string): Promise<DocumentInfoDto[]> {
        const documents = await this.db.getAllFromIndex("documents", "by-name", name);
        return documents.map(doc => documentMappers.documentToDocumentInfoDto(doc));
    }

    async uploadDocument(data: Blob): Promise<void> {
        const now = new Date();  
        const nowString = now.toISOString();
        const name = `document-${nowString}`;
        const hash = await getHash(data)

        const doc: Document = {
            hash,
            name,
            uploadedAt: now,
            data,
        }

        await this.db.put("documents", doc);
    }

    async removeDocument(hash: string): Promise<void> {
        await this.db.delete("documents", hash);
    }

    async updateDocumentName(hash: string, name: string): Promise<void> {
        const document = await this.db.get("documents", hash);
        if (!document) {
            return;
        }
        document.name = name;
        await this.db.put("documents", document);
    }
    
    // notes
    async getNoteById(id: string): Promise<BasicNoteDto | null>{
        const note = await this.db.get("notes", id);
        if(!note) return null
        return noteMappers.noteToNoteDto(note);
    }

    async getAllNotes(): Promise<BasicNoteDto[]> {
        const notes = await this.db.getAll("notes")
        return notes.map(noteMappers.noteToNoteDto);
    }

    async updateNote(note: Note): Promise<void> {
        const dbNote = await this.db.get("notes", note.id);
        if(!dbNote) return
        await this.db.put("notes", note)
    }

    // should be without coord
    async createNote(front: string, back: string){
        const note: Note = {
            id: v4(),
            front,
            back,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        const tx = this.getTx();

        await Promise.all([
            tx.noteStore.add(note),
            tx.tx.done
        ]);
    }

    async deleteNote(id: string){
        const [answerIds, positionIds, noteGridConfigIds] = await Promise.all([
            this.db.getAllKeysFromIndex("answers", "by-noteId", id),
            this.db.getAllKeysFromIndex("positions", "by-noteId", id),
            this.db.getAllKeysFromIndex("gridNoteConfigs", "by-noteId", id)
        ]);

        const tx = this.getTx();

        await Promise.all([
            tx.noteStore.delete(id),
            ...positionIds.map(tx.positionStore.delete),
            ...answerIds.map(tx.answerStore.delete),
            ...noteGridConfigIds.map(tx.gridNoteConfigStore.delete),
            tx.tx.done 
        ]);
    }

    async getNotePosition(noteId: string, gridId: string): Promise<Coord | null>{
        const position = await this.db.getFromIndex("positions", "by-ids", [noteId, gridId])
        if(!position) return null;
        return position.coord;
    }

    async getNoteByPosition(gridId: string, coord: Coord){
        const position = await this.db.getFromIndex("positions", "by-coord", [gridId, coord.x, coord.y]);
        if(!position) return null
        return await this.db.get("notes", position.noteId); 
    }


    // note config
    async getNoteConfig(gridId: string, noteId: string): Promise<GridNoteConfig | null> {
        const config = await this.db.get("gridNoteConfigs", [gridId, noteId]);
        if(!config) return null
        return config
    }

    // grid
    async getGridList(): Promise<Grid[]> {
        return await this.db.getAll("grids");
    }

    async createGrid(name: string): Promise<void> {
        const grid: Grid = {
            id: v4(),
            name, 
            createdAt: Date.now()
        }

        await this.db.add("grids", grid);
    }

    async addNoteToGrid(gridId: string, noteId: string, coord: Coord): Promise<number>{
        const position: Omit<Position, "id"> = {
            noteId,
            gridId,
            coord
        }
        return await this.db.add("positions", position as Position)
    }

    async answer(noteId: string, gridId: string, answer: Ease, nextInterval: number){
        let noteConfig = await this.db.get("gridNoteConfigs", [gridId, noteId]);
        if(!noteConfig){
            noteConfig = {
                id: v4(),
                noteId, 
                gridId,
                currentOpenInterval: nextInterval
            }
        }
        else {
            noteConfig.currentOpenInterval = nextInterval;
        }

        const tx = this.getTx();
        await Promise.all([
            tx.answerStore.add({
                id: v4(),
                noteId,
                gridId,
                answer,
                timestamp: Date.now()
            }),
            tx.gridNoteConfigStore.put(noteConfig),
            tx.tx.done
        ]);
    }

    async dump(){

    }

    async clear(){
        await Promise.all(
            [...this.db.objectStoreNames]
            .map(name => this.db.clear(name))
        )
    }
}