import { api } from "../api";
import { type ListNotesResponseDto } from "./list.dtos";


export const listApi = api.injectEndpoints({
    endpoints: builder => ({

        getNoteIds: builder.query<ListNotesResponseDto, string>({
            queryFn: async (listId) => {
                return { data: { notes: [] } }
            }
        })

    })
})

export const {
    useGetNoteIdsQuery
} = listApi