import { useEffect, useEffectEvent, useState } from "react"
import { useAppDispatch } from "../app/hooks"
import { setTime } from "./list.slice"

export const useIncrementTime = () => {

    const dispatch = useAppDispatch()       
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

    const updateIntervalId = useEffectEvent((id: NodeJS.Timeout) => setIntervalId(id))

    useEffect(() => {
        const id = setInterval(() => {
            dispatch(setTime())
        }, 1000);

        updateIntervalId(id)

        return () => {
            if(intervalId){
                clearInterval(intervalId)
                setIntervalId(null)
            }
        }
    }, [])

}