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
                    // return { data: await db.getDocumentList() }
                    return { data : undefined }
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
            }
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
        })
    })
})

export const {
    useGetDocumentListQuery,
    useGetDocumentQuery,

    useUploadDocumentMutation,
    useRenameDocumentMutation,
    useDeleteDocumentMutation,
} = documentApi;