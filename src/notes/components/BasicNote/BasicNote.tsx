import { useEffect, useEffectEvent, useState, type FC } from "react"
import type { IBasicNote as BasicNoteRecord } from "../../../db/entities/Note"
import { useGetIntervalQuery } from "../../note.api"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { selectMode, selectTime } from "../../../List/list.selectors"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setListMode, type ListMode } from "../../../List/list.slice"
import { getBlurValue } from "../../utils/getBlurValue"

dayjs.extend(duration)

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
            updateRemained(null)
        }
        else if(currentMode.kind === 'showAll'){
            updateIsOpen(0)
            updateRemained(null)
        }
        else if(interval){
            const remained = interval.openTimestamp + interval.openDuration - currentTime
            if(remained > 0){
                const formatted = dayjs.duration(remained / 1000, 'seconds').format("HH:mm:ss")
                updateIsOpen(getBlurValue(Date.now() - interval.openTimestamp))
                updateRemained(formatted)
            }
            else {
                updateIsOpen(null)
                updateRemained(null)
            }
        }
    }, [currentTime, currentMode, isError, isLoading, interval])

    const handleClick = () => {
        if(currentMode.kind === 'onAnswer') return
        dispatch(setListMode({kind: 'onAnswer', noteId: id}))
    } 

    return (
        <div 
            className="w-full h-full flex justify-center items-center px-5"
        >
            <div className="w-full h-full grid gap-2 grid-cols-[50%_50%]">
                <div>
                    <span>{front}</span>
                </div>

                <div
                    onClick={handleClick} 
                >
                    <span
                        style={{filter: isOpen === null ? "none" : `blur(${isOpen}px)`}} 
                    >{isOpen !== null  ? back : "_______"}</span>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    {remained && <span>{remained}</span>}
                </div>
            </div>
        </div>
    )
}