import type { RootState } from "../app/store";

export const selectMode = (root: RootState) => root.listReducer.mode
export const selectTime = (root: RootState) => root.listReducer.time