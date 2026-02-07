import { useEffect, useEffectEvent, useState, type FC } from "react"
import type { IBasicNote as BasicNoteRecord } from "../../../db/entities/Note"
import { useGetIntervalQuery } from "../../note.api"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { selectMode, selectTime } from "../../../List/list.selectors"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setListMode, type ListMode2 } from "../../../List/list.slice"

dayjs.extend(duration)

export const BasicNote: FC<BasicNoteRecord> = ({id, front, back}) => {

    const { data: interval, isError, isLoading } = useGetIntervalQuery(id)
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const [remained, setReamined] = useState<string | null>(null)

    const currentMode = useAppSelector(selectMode)
    const currentTime = useAppSelector(selectTime)

    const updateIsOpen = useEffectEvent((opened: boolean) => setIsOpen(opened))
    const updateRemained = useEffectEvent((remained: string | null) => setReamined(remained))

    const dispatch = useAppDispatch()    

    useEffect(() => {
        if(isError || isLoading){
            updateIsOpen(true)
        }
        else if(currentMode.kind !== 'onAnswer' && currentMode.kind !== 'onReview'){
            updateIsOpen(true)
        }
        else if(interval){
            const remained = interval.openTimestamp + interval.openDuration - currentTime
            updateIsOpen(remained > 0)
        }
    }, [currentTime, currentMode, isError, isLoading, interval])

    useEffect(() => {
        if(!isOpen || !interval){
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

    // useEffect(() => {
    //     if(!isError && !isLoading && interval){
    //         const closeTime = interval.openTimestamp + interval.openDuration
    //         const opened = Date.now() < closeTime
    //         // setIsOpen(opened)
    //         updateIsOpen(opened)

    //         const reaminedUpdater = () => {
    //             const rem = Math.floor((closeTime - Date.now()))
    //             if(rem < 0){
    //                 if(intervalId) clearInterval(intervalId)
    //                 setIntervalId(null)
    //                 setIsOpen(false)
    //                 setReamined(null)
    //             }
    //             else {
    //                 const formatted = dayjs.duration(rem / 1000, 'seconds').format("HH:mm:ss")
    //                 setReamined(formatted)
    //             }
    //         }

    //         if(opened){
    //             const id = setInterval(reaminedUpdater, 1000)
    //             // setIntervalId(id)
    //             updateIntervalId(id)
    //         }

    //         return () => {
    //             if(intervalId){
    //                 clearInterval(intervalId)
    //                 setIntervalId(null)
    //             }
    //         }
    //     }
    // }, [interval, isError, isLoading])

     

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
                    <span>{isOpen  ? back : "_______"}</span>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    {remained && currentMode.kind === 'onReview' && <span>{remained}</span>}
                </div>
            </div>
        </div>
    )
}