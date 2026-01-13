import { api } from "../api";
import { getDb } from "../db/LocalDb";
import { 
    type CreatebasicNoteDto, 
    type BasicNoteDto, 
    type NoteListDto, 
    type UpdateBasicNoteDto 
} from "./notes.dto";

export const noteApi = api.injectEndpoints({
    endpoints: builder => ({

        getNotes: builder.query<NoteListDto, void>({
            queryFn: async () => {
                try {
                    const db = await getDb() 
                    return { data: {notes: await db.getAllNotes() } }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        getNote: builder.query<BasicNoteDto, string>({
            queryFn: async(id) => {
                try {

                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
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

        updateBasicNote: builder.mutation<void, UpdateBasicNoteDto>({
            queryFn: async (req) => {
                try {

                    return { data: undefined }
                }
                catch(error){
                    return { error }
                }
            }
        }),

        deleteBasicNote: builder.mutation<void, string>({
            queryFn: async (id) => {
                try {

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
    useGetNotesQuery,
    useGetNoteQuery,

    useCreateBasicNoteMutation,
    useUpdateBasicNoteMutation,
    useDeleteBasicNoteMutation
} = noteApi;