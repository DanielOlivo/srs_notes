import type { RootState } from "../app/store";

export const selectCurrentMode = (state: RootState) => state.gridReducer.mode