import { v4 } from "uuid";
import type { AppStore } from "../../app/store";
import type { IDeletedDoc } from "../../db/entities/deletedDoc";
import type { IDeletedNote } from "../../db/entities/deletedNote";
import type { IDocument } from "../../db/entities/document";
import type { IInterval } from "../../db/entities/interval";
import type { Note, NoteData } from "../../db/entities/Note";
import type { IPosition } from "../../db/entities/position";
import { documentApi } from "../../documents/document.api";
import { DocId, type IDocId } from "../../documents/document.defs";
import { noteApi } from "../../notes/note.api";
import type { INoteId } from "../../notes/note.defs";

export interface ICacheData {
    documents: IDocument[],
    notes: Note[],
    positions: IPosition[],
    intervals: IInterval[],

    deletedDocs: IDeletedDoc[],
    deletedNotes: IDeletedNote[]
}

export const loadToStore = (data: ICacheData, store: AppStore) => {

    const deletedDocIds = new Set( data.deletedDocs.map(d => d.id) )

    data.documents.forEach(doc => store.dispatch(
        documentApi.util.upsertQueryData('getDocument', doc.id, doc)
    ))

    store.dispatch(
        documentApi.util.upsertQueryData(
            'getDocumentList',
            undefined,
            data.documents.filter(doc => !deletedDocIds.has( doc.id )).map(doc => doc.id)
        )
    )

    store.dispatch(
        documentApi.util.upsertQueryData(
            'getTrashedDocuments', 
            undefined, 
            data.documents.filter(doc => deletedDocIds.has( doc.id )).map(doc => doc.id)
        )
    )

    data.notes.forEach(note => store.dispatch(
        noteApi.util.upsertQueryData('getNote', note.id, note)
    ))

    const groupedPositions = new Map<string, IPosition[]>()
    data.positions.forEach(pos => 
        groupedPositions.has(pos.documentId)
        ? groupedPositions.get(pos.documentId)!.push(pos)
        : groupedPositions.set(pos.documentId, [ pos ])
    )
    groupedPositions.forEach(positions =>
        positions.sort((a, b) => a.coord.y - b.coord.y)
    );

    const deletedNoteIds = new Set( data.deletedNotes.map(note => note.id) )

    groupedPositions.forEach((positions, docId) => store.dispatch(
        noteApi.util.upsertQueryData(
            "getDocNotes", 
            docId, 
            positions
            .filter(pos => !deletedNoteIds.has(pos.noteId))
            .map(pos => pos.noteId)
        )
    ))

    data.intervals.forEach(int => store.dispatch(
        noteApi.util.upsertQueryData('getInterval', int.noteId, int)
    ))
}

/**
 * Use to assign parameters.redux field in stories
 */
export class CacheData implements ICacheData {
    documents: IDocument[] = [];
    notes: Note[] = []
    positions: IPosition[] = []
    intervals: IInterval[] = []
    deletedDocs = []
    deletedNotes = []

    static create = (fn: (data: CacheData) => void): ICacheData => {
        const data = new CacheData()
        fn(data)
        return data.asPlain()
    }

    asPlain = (): ICacheData => ({
        documents: this.documents,
        notes: this.notes,
        positions: this.positions,
        intervals: this.intervals,
        deletedDocs: this.deletedDocs,
        deletedNotes: this.deletedNotes
    })

    createDoc = (name: string): IDocument => {
        const doc: IDocument = {
            id: DocId.create(v4()),
            name,
            type: 'list',
            createdAt: Date.now(),
        }
        this.documents.push(doc)
        return doc
    } 

    createNote = (id: INoteId, docId: IDocId,  data: NoteData) => {
        const note: Note = {
            id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            ...data
        }
        const y = this.positions.length === 0 ? 0 : Math.max( ...this.positions.map(pos => pos.coord.y) ) + 1
        const position: IPosition = {
            id: 0,
            noteId: id,
            documentId: docId,
            coord: { x: 0, y}
        }
        this.notes.push(note)
        this.positions.push(position)
        return { note, position }
    }

    createInterval = (id: INoteId, openTimestamp: number, openDuration: number) => {
        const interval: IInterval = {
            id: v4(),
            noteId: id,
            openTimestamp,
            openDuration
        }
        this.intervals.push(interval)
        return interval
    }
}