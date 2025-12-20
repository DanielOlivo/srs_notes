import { api } from "../api";
import { getDb, type Note } from "../db/LocalDb";
import type { CreateNoteDto } from "../dtos/CreateNoteDto";
import { type Coord } from "../utils/Coord";

export const wordApi = api.injectEndpoints({
    endpoints: builder => ({

        getAllNotes: builder.query<Note[], void>({
            queryFn: async () => {
                try {
                    const db = await getDb();
                    return { data: await db.getAllNotes() };
                } catch (error) {
                    return { error };
                }
            }
        }),

        getNoteById: builder.query<Note, string>({
            queryFn: async (id) => {
                try{
                    const db = await getDb();
                    return { data: await db.getNoteById(id) };
                }
                catch(error){
                    return { error };
                }
            }
        }),

        getNoteByPosition: builder.query<Note | null, Coord>({
            queryFn: async (coord) => {
                try{
                    const db = await getDb();
                    return { data: await db.getNoteByPosition(coord)};
                }
                catch(error){
                    return { error };
                }
            }
        }),

        createNote: builder.mutation<void, CreateNoteDto>({
            queryFn: async ({front, back, coord}) => {
                try{
                    const db = await getDb();
                    await db.createNote(front, back, coord);
                    return { data: undefined };
                }
                catch (error){
                    return { error }
                }
            }
        })

    })
})


export const {
    useGetAllNotesQuery,
    useLazyGetNoteByIdQuery,
    useGetNoteByPositionQuery
} = wordApi;