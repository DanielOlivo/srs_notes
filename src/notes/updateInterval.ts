import type { Ease } from "../db/entities/answer"
import type { IInterval } from "../db/entities/interval"

export const getNextInterval = (interval: IInterval | undefined, ease: Ease): number => {
    const defaultValue = 30 * 1000
    if(!interval)
        return defaultValue // 30 sec
    const now = Date.now()
    const isClosed = (interval.openTimestamp + interval.openDuration) < now
    const duration = interval.openDuration
    switch(ease){
        case 'Again': return defaultValue
        case 'Hard': return isClosed ? duration : duration * 0.99
        case 'Good': return isClosed ? duration * 1.1 : duration * 1.01
        case 'Easy': return isClosed ? duration * 1.2 : duration * 1.02
    }
}