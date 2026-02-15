import { api } from "../api";
import type { IDocument } from "../db/entities/document";
import { type IScrollPosition } from "../db/entities/scrollPosition";
import { getDb } from "../db/LocalDb";
import { seed } from "../db/seed";
import { 
    type CreateDocumentRequestDto,
    type DocumentRenameRequestDto, 
} from "./document.dto";

export const documentApi = api.injectEndpoints({
    endpoints: builder => ({

        getDocumentList: builder.query<string[], void>({
            queryFn: async (_arg, { dispatch }) => {
                try{
                    const db = await getDb()
                    const docs = await db.getDocumentList()
                    for(const doc of docs){
                        dispatch(documentApi.util.upsertQueryData('getDocument', doc.id, doc))
                    } 
                    return { data: docs.map(doc => doc.id) }
                }
                catch(error) {
                    return { error }
                }
            },
            providesTags: ['DocumentList']
        }),

        getDocument: builder.query<IDocument | undefined, string>({
            queryFn: async(docId) => {
                try{
                    const db = await getDb()
                    const doc = await db.getDocumentById(docId)
                    return { data: doc }
                }
                catch(error){
                    return { error }
                }
            },
            providesTags: (_result, _error, docId) => [{type: "DocumentList" as const, id: docId}]
        }),

        seed: builder.mutation<void, void>({
            queryFn: async () => {
                await seed()
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList"]
        }),

        create: builder.mutation<void, CreateDocumentRequestDto>({
            queryFn: async ({name, type}) => {
                const db = await getDb()
                await db.createDocument(name, type)
                return { data: undefined }
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
            },
            invalidatesTags: ["DocumentList"]
        }),

        deleteAllDocuments: builder.mutation<void, void>({
            queryFn: async () => {
                const db = await getDb();
                await db.clear();
                return { data: undefined }
            },
            invalidatesTags: ["DocumentList", "DocumentNotes"]
        }),

        getDocumentScrollPosition: builder.query<string | null, string>({ 
            queryFn: async(docId) => {
                const db = await getDb()
                const noteId = await db.getScrollPosition(docId)
                return { data: noteId ?? null }
            },
            providesTags: (_result, _error, docId) => [
                {type: "ScrollPosition" as const, id: docId}
            ]
        }),

        setDocumentScrollPosition: builder.mutation<void, IScrollPosition>({
            queryFn: async({id, noteId}) => {
                const db = await getDb()
                await db.setScrollPosition(id, noteId)
                return { data: undefined }
            },
            invalidatesTags: (_result, _error, data) => [
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
    useRenameDocumentMutation,
    useDeleteDocumentMutation,

    useDeleteAllDocumentsMutation,

    useGetDocumentScrollPositionQuery,
    useLazyGetDocumentScrollPositionQuery,
    useSetDocumentScrollPositionMutation
} = documentApi;