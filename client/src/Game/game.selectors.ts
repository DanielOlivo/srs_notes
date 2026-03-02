import type { RootState } from "../app/store";

export const selectIsOnAnswer = (state: RootState) => state.gameReducer.onAnswer