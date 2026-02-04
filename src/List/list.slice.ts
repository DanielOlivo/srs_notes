import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type None = {
    kind: 'none'
}

type AddNew = {
    kind: 'new'
}

type Edit = {
    kind: 'edit'
    // noteId: string
}

type OnUpdate = {
    kind: 'onUpdate'
    noteId: string
}

type OnReview = {
    kind: 'onReview'
}

type OnAnswer = {
    kind: 'onAnswer'
    noteId: string
}

type EditMode = None | AddNew | Edit

export type ListMode = ListState["mode"]

export type ListMode2 = None | OnReview | OnAnswer | AddNew | Edit | OnUpdate

export interface ListState {
    // mode: "normal" | "review" | "edit"
    // editMode: EditMode
    mode: ListMode2
    time: number
}


const initital: ListState = {
    // mode: "normal",
    // editMode: { kind: 'none' }
    mode: { kind: 'none' },
    time: Date.now()
}

export const listSlice = createSlice({
    name: "list",
    initialState: initital,
    reducers: {

        setListMode: (state, action: PayloadAction<ListMode2>) => {
            state.mode = action.payload
        },

        setTime: (state) => {
            state.time = Date.now()
        }
        // setEditMode: (state, action: PayloadAction<EditMode>) => {
        //     state.editMode = action.payload
        // },
    }
})

export const { 
    setListMode,
    // setEditMode
    setTime,
} = listSlice.actions
export const listReducer = listSlice.reducer

export function isAddNew(mode: EditMode): mode is AddNew {
    return mode.kind === "new"
}

export function isEdit(mode: EditMode): mode is Edit {
    return mode.kind === "edit"
}