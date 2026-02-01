import { api } from "../api";
import type { AppStore } from "../app/store";
import type { IDocument } from "../db/entities/document";
import { type NoteData, type Note } from "../db/entities/Note";
import type { Position } from "../db/entities/position";
import { getDb } from "../db/LocalDb";
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

export const noteApi = api.injectEndpoints({
    endpoints: builder => ({

        getDocNotes: builder.query<string[], string>({
            queryFn: async(docId, { dispatch }) => {
                try{
                    const db = await getDb()
                    const { notes, positions } = await db.getAllDocNotes(docId)

                    for(const note of notes){
                        dispatch(
                            noteApi.util.upsertQueryData("getNote", note!.id, note!)
                        )
                    }

                    return { data: notes.map(note => note!.id) }
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
            }
        }),

        getNotePositions: builder.query<Position[], string[]>({
            queryFn: async(noteIds) => {
                try {
                    const db = await getDb()
                    const positions = await db.getNotePositions(noteIds)
                    if(positions.some(pos => pos === undefined)){
                        throw new Error(`some positions are undefined`)
                    }
                    return { data: positions as Position[] }
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
            queryFn: async({data, docId}) => {
                const db = await getDb()
                await db.createListNote(docId, data)
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


        updateNote: builder.mutation<void, UpdateNoteDto>({
            queryFn: async (data) => {
                return { data: undefined }
            }
        }),

        updateBasicNote: builder.mutation<void, UpdateBasicNoteDto>({
            queryFn: async (req) => {
                try {
                    const db = await getDb()
                    // await db.updateNote()
                    // throw new NotImplemented()
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        deleteNote: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {
                    const db = await getDb()
                    await db.deleteNote(id) 
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        answer: builder.mutation<void, AnswerReqDto>({
            queryFn: async ({noteId, ease}) => {
                const db = await getDb()
                const nextInterval = 10000000
                db.answer(noteId, ease, nextInterval)
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
    useUpdateBasicNoteMutation,

    useGetIntervalQuery,
    // useDeleteBasicNoteMutation

    useAnswerMutation,
} = noteApi;


export type NoteApiData = {
    documents: IDocument[]
    notes: Note[]
    positions: Position[]
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