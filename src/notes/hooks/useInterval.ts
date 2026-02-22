import { useEffect, useEffectEvent, useState } from "react";
import { useGetIntervalQuery } from "../note.api";
import type { INoteId } from "../note.defs";
import { useAppSelector } from "../../app/hooks";
import { selectTime } from "../../List/list.selectors";

type Opened = {
    kind: "open"
    passed: number
    remained: number
}

type Closed = {
    kind: "close"
}

type None = {
    kind: 'none'
}

type State = Opened | Closed | None

export const useInterval = (noteId: INoteId) => {
    const { data: interval } = useGetIntervalQuery(noteId)
    const [state, setState] = useState<State>({kind: 'none'})
    const updateState = useEffectEvent(setState)

    const currentTime = useAppSelector(selectTime) 

    useEffect(() => {
        if(!interval) return

        const { openTimestamp, openDuration } = interval
        const remained = openTimestamp + openDuration - currentTime

        const currentState: State = remained < 0
            ? { kind: 'close'}
            : {
                kind: 'open',
                remained,
                passed: currentTime - openTimestamp
            }
        
        updateState(currentState)
        
    }, [currentTime, interval])  

    return { state }
}