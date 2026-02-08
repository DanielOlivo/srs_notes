import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// type Theme = 'light' | 'dark'
const key = "theme"

type ThemeSlice = {
    isDark: boolean
}

const initialState: ThemeSlice = {
    isDark: false
}

export const slice = createSlice({
    name: 'theme',
    initialState,
    reducers: {

        setDark: (state, action: PayloadAction<boolean>) => {
            state.isDark = action.payload
            // console.log("from slice", state.isDark)
            localStorage.setItem(key, action.payload ? 'dark' : 'light')
        },

        getFromLocalStorage: (state) => {
            const theme = localStorage.getItem(key)
            if(theme){
                state.isDark = theme === 'dark'
            }
            else {
                state.isDark = false
                localStorage.setItem(key, "light")
            }
        }
    }
})
export const { setDark, getFromLocalStorage } = slice.actions
export default slice.reducer