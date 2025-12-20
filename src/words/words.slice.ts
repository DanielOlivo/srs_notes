import { createSlice } from "@reduxjs/toolkit";
import { getWords, type TestRecord } from "./words.thunks";

interface WordsState {
    x: number
    records: TestRecord[]
}

const initialState: WordsState = {
    x: 0,
    records: []
}

const slice = createSlice({
    name: "words",
    initialState,
    reducers: {},
    // extraReducers: builder => {
    //     builder.addCase(getWords.fulfilled, (state, action) => {
    //         state.records = action.payload;
    //     })
    // }
})

export default slice.reducer;