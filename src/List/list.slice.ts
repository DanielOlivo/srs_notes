import { createSlice } from "@reduxjs/toolkit"

export interface ListState {
    mode: "normal" | "review"
}

const initital: ListState = {
    mode: "normal"
}

export const listSlice = createSlice({
    name: "list",
    initialState: initital,
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
        }
    }
})

export const { setMode } = listSlice.actions
export const listReducer = listSlice.reducer