import { api } from "../api";
import type { AppStore } from "../app/store";
import type { IDocument } from "../db/entities/document";
import { type NoteData, type Note } from "../db/entities/Note";
import { Position, type IPosition } from "../db/entities/position";
import { getDb, withTx, type Tx } from "../db/LocalDb";
import { NotImplemented } from "../utils/NotImplemented";
import { 
    type AnswerReqDto,
    type CreatebasicNoteDto, 
    type CreateNote, 
    type UpdateBasicNoteDto, 
    type UpdateNoteDto,
} from "./notes.dto";
import { groupBy } from "../utils/groupBy";
import type { IInterval } from "../db/entities/interval";
import { documentApi } from "../documents/document.api";
import { Answer } from "../db/entities/answer";
import { v4 } from "uuid";
import { BaseNote, Interval } from "../db/entities/Note.utils";
import { getNextInterval } from "./updateInterval";

export const noteApi = api.injectEndpoints({
    endpoints: builder => ({

        getDocNotes: builder.query<string[], string>({
            queryFn: async(docId, { dispatch }) => {
                try{
                    const [ positions ] = await withTx(
                        Position.getByDocIdTx(docId)
                    )
                    positions.sort((a, b) => a.coord.y - b.coord.y)

                    const notes = await withTx(
                        ...positions.map(pos => BaseNote.getTx(pos.noteId))
                    )

                    for(const note of notes){
                        if(note){
                            dispatch(
                                noteApi.util.upsertQueryData("getNote", note.id, note.asPlain())
                            )
                        }
                    }

                    return { data: positions.map(pos => pos.noteId) }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (result, error, docId) => [
                { type: "DocumentNotes", docId}
            ]
        }),

        getNote: builder.query<Note, string>({
            queryFn: async(id) => {
                try {
                    const db = await getDb()
                    const note = await db.getNoteById(id)
                    return { data: note }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (result, error, noteId) => [
                { type: "Note", noteId }
            ]
        }),

        getNotePositions: builder.query<IPosition[], string[]>({
            queryFn: async(noteIds) => {
                try {
                    const db = await getDb()
                    const positions = await db.getNotePositions(noteIds)
                    if(positions.some(pos => pos === undefined)){
                        throw new Error(`some positions are undefined`)
                    }
                    return { data: positions as IPosition[] }
                }
                catch(error){
                    return {error}
                }
            }
        }),

        getInterval: builder.query<IInterval, string>({
            queryFn: async(noteId) => {
                try{
                    const db = await getDb()
                    // throw new Error("getInterval not implemented")
                    const interval = await db.getIntervalByNoteId(noteId)
                    if(!interval) throw new Error(`interval for note ${noteId} not found`)
                    return { data: interval }
                }
                catch(error){
                    return { error, data: undefined }
                }
            },
            providesTags: (result, error, noteId) => [
                { type: "Interval", noteId }
            ]
        }),

        createNote: builder.mutation<void, CreateNote /*NoteData*/ >({
            queryFn: async({data, docId, coord}) => {
                const db = await getDb()
                if(coord){
                    await db.createListNoteAtPos(docId, data, coord)
                }
                else {
                    await db.createListNote(docId, data)
                }
                return { data: undefined}
            },
            invalidatesTags: (result, error, req) => [
                { type: "DocumentNotes", docId: req.docId }
            ]
        }),

        createBasicNote: builder.mutation<void, CreatebasicNoteDto>({
            queryFn: async(dto) => {
                try {

                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        updateNote: builder.mutation<void, Note>({
            queryFn: async (note) => {
                const db = await getDb()
                await db.updateNote(note) 
                return { data: undefined }
            },
            invalidatesTags: (result, error, req) => [
                { type: "Note", noteId: req.id }
            ]
        }),

        deleteNote: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    const [note, position, interval] = await withTx(
                        BaseNote.getTx(id),
                        Position.getByNoteIdTx(id),
                        Interval.getByNoteIdTx(id) 
                    )

                    const dummyFn = async () => {}

                    await withTx(
                        note?.removeTx ?? dummyFn,
                        position?.removeTx ?? dummyFn,
                        interval?.removeTx() ?? dummyFn,
                    )

                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        answer: builder.mutation<void, AnswerReqDto>({
            queryFn: async ({noteId, ease}) => {
                const answer = new Answer(v4(), noteId, ease, Date.now())

                const interval = await Interval.getByNoteId(noteId)
                const nextInterval = getNextInterval(interval?.openDuration, ease)
                const updateInterval = (() => {
                    if(!interval){
                        const toCreate = new Interval(
                            v4(),
                            noteId,
                            nextInterval,
                            Date.now()
                        )
                        return toCreate.addTx()
                    }
                    return interval.updateTx(nextInterval)

                })()
                
                await withTx(
                    answer.createTx(),
                    updateInterval
                )

                return { data: undefined }
            },
            invalidatesTags: (result, error, req) => [
                { type: "DocumentNotes", docId: req.noteId },
                { type: "Interval", noteId: req.noteId }
            ]
        })
    }) 
})

export const {
    useGetDocNotesQuery,
    // useGetAllNotesQuery,
    useGetNoteQuery,
    useLazyGetNoteQuery,


    useCreateNoteMutation,
    useUpdateNoteMutation,

    useCreateBasicNoteMutation,

    useGetIntervalQuery,
    // useDeleteBasicNoteMutation

    useAnswerMutation,
} = noteApi;


export type NoteApiData = {
    documents: IDocument[]
    notes: Note[]
    positions: IPosition[]
    intervals: IInterval[]
}

export const handleNoteCache = (data: NoteApiData, store: AppStore) => {

    // here is a reference to document.api, which is not good
    for(const doc of data.documents){
        store.dispatch(
            documentApi.util.upsertQueryData('getDocument', doc.id, doc)
        )
    }
    store.dispatch(
        documentApi.util.upsertQueryData(
            'getDocumentList', 
            undefined, 
            data.documents.map(doc => doc.id)
        ) 
    )

    // getDocNotes
    const grouped = groupBy(data.positions, p => p.documentId)// Object.groupBy(data.positions)
    for(const positions of Object.values(grouped)){
        positions.sort((a, b) => a.coord.y - b.coord.y)
        const docId = positions[0].documentId
        const noteIds = positions.map(pos => pos.noteId)
        store.dispatch(
            noteApi.util.upsertQueryData("getDocNotes", docId, noteIds)
        )
    }

    // getNote
    for(const note of data.notes){
        store.dispatch(
            noteApi.util.upsertQueryData("getNote", note.id, note)
        )
    }

    // intervals
    for(const interval of data.intervals){
        store.dispatch(
            noteApi.util.upsertQueryData('getInterval', interval.noteId, interval)
        )
    }
}