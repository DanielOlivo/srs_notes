import { useCallback, useEffect, useRef } from "react"

type Handler = () => void

export const useDebounce = (delay: number) => {

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const run = useCallback((fn: Handler) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            fn()
        }, delay)
    }, [delay])

    useEffect(() => {
        // Clear the timeout when the component unmounts
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return { 
        run 
    } 
}