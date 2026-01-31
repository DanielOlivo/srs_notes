import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type None = {
    kind: 'none'
}

type AddNew = {
    kind: 'new'
}

type Edit = {
    kind: 'edit'
    noteId: string
}

type EditMode = None | AddNew | Edit

export interface ListState {
    mode: "normal" | "review" | "edit"
    editMode: EditMode
}

export type ListMode = ListState["mode"]

const initital: ListState = {
    mode: "normal",
    editMode: { kind: 'none' }
}

export const listSlice = createSlice({
    name: "list",
    initialState: initital,
    reducers: {

        setListMode: (state, action) => {
            state.mode = action.payload
        },

        setEditMode: (state, action: PayloadAction<EditMode>) => {
            state.editMode = action.payload
        },
    }
})

export const { 
    setListMode,
    setEditMode
} = listSlice.actions
export const listReducer = listSlice.reducer

export function isAddNew(mode: EditMode): mode is AddNew {
    return mode.kind === "new"
}

export function isEdit(mode: EditMode): mode is Edit {
    return mode.kind === "edit"
}