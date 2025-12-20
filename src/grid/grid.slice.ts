import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coord } from "../utils/Coord";


export interface NormalMode {
    kind: 'normal'
}

export type OnMoving = {
    dragStart: Coord
    client: Coord
}

export interface EditMode {
    kind: 'edit'
    selected: Coord | null

    isOver: Coord | null

    onMoving: null | OnMoving
}

export interface RearrangementMode {
    kind: 'rearrangement'
}

export interface ReviewMode {
    kind: 'review'
}

type Mode = NormalMode | EditMode | RearrangementMode | ReviewMode

export type ModeName = 'normal' | 'edit' | 'review' | 'rearrangement'


export interface GridSliceState {
    mode: Mode
}


export const initialState: GridSliceState = {
    mode: {kind: 'normal'}
}

export const slice = createSlice({
    name: "grid",
    initialState,
    reducers: {

        selectMode: (state, action: PayloadAction<ModeName>) => {
            switch(action.payload){
                case 'normal': state.mode = {kind: 'normal'}; break;
                case 'edit': {
                    state.mode = {
                        kind: 'edit', 
                        selected: null, 
                        isOver: null,
                        onMoving: null
                    }; 
                    break
                }
                case 'review': state.mode = {kind: 'review'}; break
            }
        },

        setIsOver: (state, action: PayloadAction<Coord | null>) => {
            if(state.mode.kind !== 'edit') return
            state.mode.isOver = action.payload
        },

        setOnMoving: (state, action: PayloadAction<OnMoving | null>) => {
            if(state.mode.kind !== 'edit') return
            state.mode.onMoving = action.payload
            // state.mode.onMoving = { coord: action.payload }
        },

        clearOnMoving: (state) => {
            if(state.mode.kind !== 'edit') return
            state.mode.onMoving = null
        }
    }
})

export const {
    selectMode,
    setIsOver,
    setOnMoving,
    clearOnMoving
} = slice.actions;
export default slice.reducer

export function isNormalMode(mode: Mode): mode is NormalMode {
    return mode.kind === 'normal'
}

export function isEditMode(mode: Mode): mode is EditMode {
    return mode.kind === 'edit'
}

export function isRearrangementMode(mode: Mode): mode is RearrangementMode {
    return mode.kind === 'rearrangement'
}

export function isReviewMode(mode: Mode): mode is ReviewMode {
    return mode.kind === 'review'
}