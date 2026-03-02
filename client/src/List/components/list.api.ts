import { api } from "../../api";

export const listApi = api.injectEndpoints({
    endpoints: builder => ({

        getList: builder.query<string[], string>({
            queryFn: async (id) => {
                return { data: [] }
            }
        })

    })
})