import { useEffect, useState, type FC } from "react"
import type { IBasicNote as BasicNoteRecord } from "../../../db/entities/Note"
import { useGetIntervalQuery } from "../../note.api"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

export const BasicNote: FC<BasicNoteRecord> = ({id, front, back}) => {

    const { data: interval, isError, isLoading } = useGetIntervalQuery(id)
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const [remained, setReamined] = useState<string | null>(null)

    useEffect(() => {
        if(!isError && !isLoading && interval){
            const closeTime = interval.openTimestamp + interval.openDuration
            const opened = Date.now() < closeTime
            setIsOpen(opened)

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
                const int = setInterval(reaminedUpdater, 1000)
                setIntervalId(int)
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
        <div className="w-full h-full flex justify-center items-center">
            <span>{front} - {isOpen ? back : "_______"}</span>
            {remained && <span>{remained}</span>}
        </div>
    )
}