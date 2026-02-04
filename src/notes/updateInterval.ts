import type { Ease } from "../db/entities/answer"

export const getNextInterval = (interval: number | undefined, ease: Ease) => {
    if(!interval)
        return 30 * 1000 // 30 sec
    switch(ease){
        case 'Again': return 30 * 1000
        case 'Hard': return interval
        case 'Good': return interval * 1.1
        case 'Easy': return interval * 1.2
    }
}