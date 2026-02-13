import { useEffect, useEffectEvent, useState, type FC } from "react"
import type { IBasicNote as BasicNoteRecord } from "../../../db/entities/Note"
import { useGetIntervalQuery } from "../../note.api"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { selectMode, selectTime } from "../../../List/list.selectors"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setListMode, type ListMode2 } from "../../../List/list.slice"

dayjs.extend(duration)

const getBlurValue = (duration: number) => {
    if(duration < 10000) return 0
    if(duration < 20000) return 1
    if(duration < 30000) return 2
    return 3
}

export const BasicNote: FC<BasicNoteRecord> = ({id, front, back}) => {

    const { data: interval, isError, isLoading } = useGetIntervalQuery(id)
    const [isOpen, setIsOpen] = useState<number | null>(null) // number stands for blur
    const [remained, setReamined] = useState<string | null>(null)

    const currentMode = useAppSelector(selectMode)
    const currentTime = useAppSelector(selectTime)

    const updateIsOpen = useEffectEvent((blurOrNull: number | null) => setIsOpen(blurOrNull))
    const updateRemained = useEffectEvent((remained: string | null) => setReamined(remained))

    const dispatch = useAppDispatch()    

    useEffect(() => {
        if(isError || isLoading){
            updateIsOpen(0)
        }
        else if(currentMode.kind !== 'onAnswer' && currentMode.kind !== 'onReview'){
            updateIsOpen(0)
        }
        else if(interval){
            const remained = interval.openTimestamp + interval.openDuration - currentTime
            updateIsOpen((remained > 0) ? getBlurValue(currentTime - interval.openTimestamp) : null)
        }
    }, [currentTime, currentMode, isError, isLoading, interval])

    // it might be memo
    useEffect(() => {
        if(isOpen === null || !interval){
            updateRemained(null)
            return
        }
        const remained = interval.openTimestamp + interval.openDuration - currentTime
        const formatted = dayjs.duration(remained / 1000, 'seconds').format("HH:mm:ss")
        updateRemained(formatted)

    }, [isOpen, currentTime, interval]) 

    const handleClick = () => {
        switch(currentMode.kind){
            case 'edit': case 'onUpdate': case 'new':
                dispatch(setListMode({kind: 'onUpdate', noteId: id}))
                break
            case 'onReview':
                dispatch(setListMode({kind: 'onAnswer', noteId: id}))
        }
    } 

    return (
        <div 
            className="w-full h-full flex justify-center items-center px-5"
            onClick={handleClick}
        >
            <div className="w-full h-full grid gap-2 grid-cols-[50%_50%]">
                <div>
                    <span>{front}</span>
                </div>

                <div>
                    <span
                        style={{filter: isOpen === null ? "none" : `blur(${isOpen}px)`}} 
                    >{isOpen !== null  ? back : "_______"}</span>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    {remained && currentMode.kind === 'onReview' && <span>{remained}</span>}
                </div>
            </div>
        </div>
    )
}