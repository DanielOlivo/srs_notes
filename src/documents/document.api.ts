import { api } from "../api";
import type { Data } from "../db/csv";
import { Document } from "../db/Document";
import type { IDocument } from "../db/entities/document";
import { BasicNote, Interval, TextNote } from "../db/entities/Note.utils";
import { Position } from "../db/entities/position";
import { getDb, withTx } from "../db/LocalDb";
import { seed } from "../db/seed";
import { 
    type DocumentRenameRequestDto, 
    // type DocumentDto, 
    // type DocumentListDto 
} from "./document.dto";

export const documentApi = api.injectEndpoints({
    endpoints: builder => ({

        getDocumentList: builder.query<string[], void>({
            queryFn: async () => {
                try{
                    const db = await getDb();
                    const docs = await db.getDocumentList()
                    for(const doc of docs){
                        documentApi.util.upsertQueryData('getDocument', doc.id, doc)
                    } 
                    return { data: docs.map(doc => doc.id) }
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
                    const db = await getDb();
                    return { data: await db.getDocumentById(docId) }
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
                    const db = await getDb();
                    await db.removeDocument(id);
                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        deleteAllDocuments: builder.mutation<void, void>({
            queryFn: async () => {
                const db = await getDb();
                await db.clear();
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList"]
        })
    })
})

export const {
    useGetDocumentListQuery,
    useGetDocumentQuery,

    useSeedMutation,

    useUploadDocumentMutation,
    useRenameDocumentMutation,
    useDeleteDocumentMutation,

    useDeleteAllDocumentsMutation,
} = documentApi;