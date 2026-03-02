import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface GameState {
    onAnswer: boolean
}

const initialState: GameState = {
    onAnswer: false
}

const slice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setOnAnswer: (state, action: PayloadAction<boolean>) => {
            state.onAnswer = action.payload
        }
    }
})

export default slice.reducer;
export const { setOnAnswer } = slice.actions;