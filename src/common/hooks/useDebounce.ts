import { useRef, useState } from "react"

type Handler = () => void

export const useDebounce = (delay: number) => {

    const [_timeout, _setTimeout] = useState<NodeJS.Timeout | null>(null)
    const fnRef = useRef<Handler | null>(null)
    
    const run = (fn: Handler) => {
        if(_timeout === null){
            const timeout = setTimeout(() => {
                if(fnRef.current){
                    run(fnRef.current)
                }
                else {
                    _setTimeout(null)
                    fnRef.current = null
                }
            }, delay)
            _setTimeout(timeout)
            fn()
        }
        else{
            fnRef.current = fn    
        }
    }

    return { 
        run 
    } 
}