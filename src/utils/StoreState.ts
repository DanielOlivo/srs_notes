import { v4 } from "uuid";
import type { RootState, StoreState } from "../app/store";
import type { IDocument } from "../db/entities/document";
import type { NoteApiData } from "../notes/note.api";
import type { Note, NoteData } from "../db/entities/Note";
import type { IPosition } from "../db/entities/position";
import type { IInterval } from "../db/entities/interval";
import { faker } from "@faker-js/faker";

type SlicesOnlyState = Omit<RootState, "api">

export class StoreStateUtility implements StoreState {
    slices?: Partial<SlicesOnlyState>  = undefined
    // gridApi?: GridApiData = undefined
    noteApi: NoteApiData = {
        documents: [],
        notes: [],
        positions: [],
        intervals: [],
    }

    addDocument(name: string, type: IDocument["type"]) {
        const document: IDocument = {
            id: v4(),
            name,
            type,
            createdAt: Date.now(),
        }
        this.noteApi.documents.push(document)
        return document
    } 

    static getNote(data: NoteData): Note {
        return {
            ...data,
            id: v4(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    }

    addNote(document: IDocument, data: NoteData) {
        if(document.type === 'grid'){
            throw new Error("not implemented")
        }

        const note = StoreStateUtility.getNote(data)
        const positions = this.noteApi.positions.filter(pos => pos.documentId === document.id)
        const maxY = Math.max(...positions.map(pos => pos.coord.y), 0)
        const position: IPosition = {
            id: this.noteApi.positions.length + 1,
            noteId: note.id,
            documentId: document.id,
            coord: {
                x: 0,
                y: maxY + 1
            }
        }
        this.noteApi.notes.push(note)
        this.noteApi.positions.push(position)
        return { note, position }
    }

    addInterval(note: Note, data?: Omit<IInterval, 'id' | 'noteId'>){
        const id = v4()
        const interval: IInterval = {
            id,
            noteId: note.id,
            openTimestamp: data?.openTimestamp ?? faker.date.recent().getTime(),
            openDuration: data?.openDuration ?? Math.random() * 20000,
            ...data
        }
        this.noteApi.intervals.push(interval)
        return interval
    }
}