import { createSlice } from "@reduxjs/toolkit"

export interface ListState {
    mode: "normal" | "review" | "edit"
}

export type ListMode = ListState["mode"]

const initital: ListState = {
    mode: "normal"
}

export const listSlice = createSlice({
    name: "list",
    initialState: initital,
    reducers: {
        setListMode: (state, action) => {
            state.mode = action.payload
        }
    }
})

export const { setListMode } = listSlice.actions
export const listReducer = listSlice.reducer