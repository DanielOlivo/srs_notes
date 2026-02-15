import { v4 } from "uuid";
import { api } from "../api";
import type { Data } from "../db/csv";
import { Document } from "../db/Document";
import { DeletedDoc } from "../db/entities/deletedDoc";
import type { IDocument } from "../db/entities/document";
import { BasicNote, Interval, TextNote } from "../db/entities/Note.utils";
import { Position } from "../db/entities/position";
import { ScrollPosition, type IScrollPosition } from "../db/entities/scrollPosition";
import { getDb, withTx } from "../db/LocalDb";
import { seed } from "../db/seed";
import { 
    type CreateDocumentRequestDto,
    type DocumentRenameRequestDto, 
    // type DocumentDto, 
    // type DocumentListDto 
} from "./document.dto";

export const documentApi = api.injectEndpoints({
    endpoints: builder => ({

        getDocumentList: builder.query<string[], void>({
            queryFn: async (_arg, { dispatch }) => {
                try{
                    const [docs, deleted] = await withTx(
                        Document.allTx,
                        DeletedDoc.allTx
                    ) 
                    const excluded = new Set(deleted.map(d => d.id))
                    for(const doc of docs){
                        dispatch(documentApi.util.upsertQueryData('getDocument', doc.id, doc))
                    } 
                    return { 
                        data: docs
                            .filter(doc => !excluded.has(doc.id))
                            .map(doc => doc.id) 
                        }
                }
                catch(error) {
                    return { error }
                }
            },
            providesTags: ['DocumentList']
        }),

        getDocument: builder.query<IDocument, string>({
            queryFn: async(docId) => {
                try{
                    const doc = await Document.get(docId)
                    return { data: doc?.asPlain() }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (result, error, docId) => [{type: "DocumentList" as const, id: docId}]
        }),

        seed: builder.mutation<void, void>({
            queryFn: async () => {
                await seed()
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList"]
        }),

        create: builder.mutation<void, CreateDocumentRequestDto>({
            queryFn: async (req) => {
                const { name, type } = req
                const doc = new Document(name, type, v4(), Date.now())
                await withTx(doc.addTx) 
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList"]
        }),

        uploadDocument: builder.mutation<void, Data>({
            queryFn: async (data) => {
                try{
                    await withTx(
                        Document.cleanTx(),
                        BasicNote.cleanTx(),
                        TextNote.cleanTx(),
                        Interval.cleanTx(),
                        Position.cleanTx()
                    )

                    await withTx(
                        ...Document.loadTx(data.docs),
                        ...BasicNote.loadTx(data.basicNotes),
                        ...TextNote.loadTx(data.textNotes),
                        ...Interval.loadTx(data.intervals),
                        ...Position.loadTx(data.positions)
                    )

                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            },
            invalidatesTags: ["DocumentList"]
        }),

        renameDocument: builder.mutation<void, DocumentRenameRequestDto>({
            queryFn: async({id, newName}) => {
                try{
                    const db = await getDb();
                    await db.updateDocumentName(id, newName); 
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        deleteDocument: builder.mutation<void, string>({
            queryFn: async(id) => {
                try{
                    // const db = await getDb();
                    // await db.removeDocument(id);
                    const deleted = new DeletedDoc(id, Date.now())
                    await withTx(deleted.addTx)
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            },
            invalidatesTags: ["DocumentList"]
        }),

        deleteAllDocuments: builder.mutation<void, void>({
            queryFn: async () => {
                console.log('cleaning...')
                const db = await getDb();
                await db.clear();
                console.log('...done')
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList", "DocumentNotes"]
        }),

        getDocumentScrollPosition: builder.query<string | null, string>({ 
            queryFn: async(docId) => {
                const pos = await ScrollPosition.get(docId)
                return { data: pos?.noteId ?? null }
            },
            providesTags: (result, error, docId) => [
                {type: "ScrollPosition" as const, id: docId}
            ]
        }),

        setDocumentScrollPosition: builder.mutation<void, IScrollPosition>({
            queryFn: async(data) => {
                const pos = ScrollPosition.from(data)
                await pos.update()
                return { data: undefined }
            },
            invalidatesTags: (result, error, data) => [
                {type: "ScrollPosition" as const, id: data.id}
            ]
        })
    })
})

export const {
    useGetDocumentListQuery,

    useGetDocumentQuery,
    useLazyGetDocumentQuery,

    useSeedMutation,

    useCreateMutation,
    useUploadDocumentMutation,
    useRenameDocumentMutation,
    useDeleteDocumentMutation,

    useDeleteAllDocumentsMutation,

    useGetDocumentScrollPositionQuery,
    useLazyGetDocumentScrollPositionQuery,
    useSetDocumentScrollPositionMutation
} = documentApi;