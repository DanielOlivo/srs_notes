import { api } from "../api";
import type { IDocument } from "../db/entities/document";
import { getDb } from "../db/LocalDb";
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

        uploadDocument: builder.mutation<void, Blob>({
            queryFn: async (data) => {
                try{
                    const db = await getDb();
                    await db.uploadDocument(data);
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

    useUploadDocumentMutation,
    useRenameDocumentMutation,
    useDeleteDocumentMutation,

    useDeleteAllDocumentsMutation,
} = documentApi;