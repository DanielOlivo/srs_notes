import { createApi } from "@reduxjs/toolkit/query/react";
import { getDb } from "./db/LocalDb";

export const api = createApi({
    reducerPath: "api",
    baseQuery: () => ({ data: [] }),
    endpoints: builder => ({

        clearAll: builder.mutation<void, void>({
            queryFn: async () => {
                try{
                    const db = await getDb();
                    await db.clear();
                    return { data: undefined }
                }
                catch(error){
                    return { error}
                }
            }
        })

    }),
    tagTypes: [
        "DocumentList",
        "DocumentNotes",
        "Note",
        "Interval",
        "GridList",
        "ScrollPosition"
    ]
});

export const {
    useClearAllMutation 
} = api;