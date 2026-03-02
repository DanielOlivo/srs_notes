import type { RootState } from "../app/store";

export const selectIsDark = (state: RootState) => state.themeReducer.isDark