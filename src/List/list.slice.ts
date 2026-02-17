import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type None = {
    kind: 'none'
}

type ShowAll = {
    kind: 'showAll'
}

type OnAnswer = {
    kind: 'onAnswer'
    noteId: string
}


export type ListMode = None | ShowAll | OnAnswer


export interface ListState {
    mode: ListMode
    time: number
}


const initital: ListState = {
    mode: { kind: 'none' },
    time: Date.now()
}

export const listSlice = createSlice({
    name: "list",
    initialState: initital,
    reducers: {

        setListMode: (state, action: PayloadAction<ListMode>) => {
            state.mode = action.payload
        },

        setTime: (state) => {
            state.time = Date.now()
        }
    }
})

export const { 
    setListMode,
    // setEditMode
    setTime,
} = listSlice.actions
export const listReducer = listSlice.reducer