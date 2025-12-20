import type { RootState } from "../app/store";

export const selectRecords = (state: RootState) => state.wordReducer.records;