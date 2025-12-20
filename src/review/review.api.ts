import { api } from "../api";
import { ReviewDto } from "../dtos/ReviewDto";

export const reviewApi = api.injectEndpoints({

    endpoints: builder => ({

        answer: builder.mutation<void, ReviewDto>({
            queryFn: async(dto) => ({
                data: undefined
            })
        })

    })

})