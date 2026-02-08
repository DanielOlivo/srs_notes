import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getFromLocalStorage, setDark } from "./theme.slice"
import { selectIsDark } from "./theme.selector"


export const useDarkThemeSetter = () => {
    const dispatch = useAppDispatch()
    const isDark = useAppSelector(selectIsDark)

    const setDarkTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setDark(e.target.checked))
        console.log("setDarkTheme", e.target.checked)
    }

    return { setDark: setDarkTheme, isDark }
}

export const useTheme = () => {

    const dispatch = useAppDispatch()
    const isDark = useAppSelector(selectIsDark)

    useEffect(() => {
        dispatch(getFromLocalStorage())
    }, [])

    return { isDark }
}