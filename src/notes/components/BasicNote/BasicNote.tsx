import { useEffect, useEffectEvent, useState, type FC } from "react"
import type { IBasicNote as BasicNoteRecord } from "../../../db/entities/Note"
import { useGetIntervalQuery } from "../../note.api"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { selectMode } from "../../../List/list.selectors"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { setEditMode } from "../../../List/list.slice"

dayjs.extend(duration)

export const BasicNote: FC<BasicNoteRecord> = ({id, front, back}) => {

    const { data: interval, isError, isLoading } = useGetIntervalQuery(id)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const [remained, setReamined] = useState<string | null>(null)

    const currentMode = useAppSelector(selectMode)

    const updateIsOpen = useEffectEvent((opened: boolean) => setIsOpen(opened))
    const updateIntervalId = useEffectEvent((id: NodeJS.Timeout | null) => setIntervalId(id))

    const dispatch = useAppDispatch()    

    const handleClick = () => {
        if(currentMode !== 'edit') return
        dispatch(setEditMode({kind: 'edit', noteId: id}))
    } 

    useEffect(() => {
        if(!isError && !isLoading && interval){
            const closeTime = interval.openTimestamp + interval.openDuration
            const opened = Date.now() < closeTime
            // setIsOpen(opened)
            updateIsOpen(opened)

            const reaminedUpdater = () => {
                const rem = Math.floor((closeTime - Date.now()))
                if(rem < 0){
                    if(intervalId) clearInterval(intervalId)
                    setIntervalId(null)
                    setIsOpen(false)
                    setReamined(null)
                }
                else {
                    const formatted = dayjs.duration(rem / 1000, 'seconds').format("HH:mm:ss")
                    setReamined(formatted)
                }
            }

            if(opened){
                const id = setInterval(reaminedUpdater, 1000)
                // setIntervalId(id)
                updateIntervalId(id)
            }

            return () => {
                if(intervalId){
                    clearInterval(intervalId)
                    setIntervalId(null)
                }
            }
        }
    }, [interval, isError, isLoading])

    return (
        <div 
            className="w-full h-full card"
            onClick={handleClick}
        >
            <div className="card-body grid gap-2 grid-cols-2">
                <div>
                    <span>{front}</span>
                </div>

                <div>
                    <span>{isOpen || currentMode !== 'review' ? back : "_______"}</span>
                </div>

                <div className="col-span-2 flex justify-center items-center">
                    {remained && currentMode === 'review' && <span>{remained}</span>}
                </div>
            </div>
        </div>
    )
}