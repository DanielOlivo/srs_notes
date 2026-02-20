import { api } from "../api";
import type { AppStore } from "../app/store";
import type { IDocument } from "../db/entities/document";
import { type Note } from "../db/entities/Note";
import { type IPosition } from "../db/entities/position";
import { getDb } from "../db/LocalDb";
import { 
    type AnswerReqDto,
    type CreateNote,
    type DeleteNoteDto, 
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
                            if(note.kind === 'image'){
                                const { data: _, ...rest} = note
                                dispatch(
                                    noteApi.util.upsertQueryData("getNote", rest.id, rest)
                                )

                            }
                            else {
                                dispatch(
                                    noteApi.util.upsertQueryData("getNote", note.id, note)
                                )
                            }
                        }
                    }

                    return { data: notes.map(note => note.id) }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (_result, _error, docId) => [
                { type: "DocumentNotes", docId}
            ]
        }),

        getNote: builder.query<Note | undefined, string>({
            queryFn: async(id) => {
                try {
                    const db = await getDb()
                    const note = await db.getNoteById(id)
                    
                    if(note && note.kind === 'image'){
                        const { data: _, ...rest} = note.asPlain()
                        return { data: rest}
                    }
                    return { data: note?.asPlain() }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (_result, _error, noteId) => [
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
            providesTags: (_result, _error, noteId) => [
                { type: "Interval", noteId }
            ]
        }),

        createNote: builder.mutation<void, CreateNote /*NoteData*/ >({
            queryFn: async({data, docId, coord}) => {
                const db = await getDb()
                await db.createListNote(docId, data, coord)
                return { data: undefined}
            },
            invalidatesTags: (_result, _error, req) => [
                { type: "DocumentNotes", docId: req.docId }
            ]
        }),

        updateNote: builder.mutation<void, Note>({
            queryFn: async (note) => {
                const db = await getDb()
                await db.updateNote(note) 
                return { data: undefined }
            },
            invalidatesTags: (_result, _error, req) => [
                { type: "Note", noteId: req.id }
            ]
        }),

        deleteNote: builder.mutation<void, DeleteNoteDto>({
            queryFn: async ({noteId}) => {
                try {
                    const db = await getDb()
                    await db.deleteNote(noteId)
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            },
            invalidatesTags: (_result, _error, req) => [
                { type: "Note", noteId: req.noteId },
                { type: "DocumentNotes", docId: req.docId }
            ]
        }),

        answer: builder.mutation<void, AnswerReqDto>({
            queryFn: async ({noteId, ease}) => {
                const db = await getDb()
                await db.answer(noteId, ease)
                return { data: undefined }
            },
            invalidatesTags: (_result, _error, req) => [
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