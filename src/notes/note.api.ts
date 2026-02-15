import { api } from "../api";
import type { AppStore } from "../app/store";
import type { IDocument } from "../db/entities/document";
import { type Note } from "../db/entities/Note";
import { type IPosition } from "../db/entities/position";
import { getDb } from "../db/LocalDb";
import { 
    type AnswerReqDto,
    type CreateNote, 
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
                    const notes = await db.getDocNotes(docId)

                    for(const note of notes){
                        if(note){
                            dispatch(
                                noteApi.util.upsertQueryData("getNote", note.id, note)
                            )
                        }
                    }

                    return { data: notes.map(note => note.id) }
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

        getInterval: builder.query<IInterval, string>({
            queryFn: async(noteId) => {
                try{
                    const db = await getDb()
                    const interval = await db.getIntervalByNoteId(noteId)
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
                    const db = await getDb()
                    await db.deleteNote(id)
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            },
        }),

        answer: builder.mutation<void, AnswerReqDto>({
            queryFn: async ({noteId, ease}) => {
                const db = await getDb()
                await db.answer(noteId, ease)
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

    useGetIntervalQuery,
    useDeleteNoteMutation,

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