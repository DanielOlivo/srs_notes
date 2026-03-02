import { useEffect, useMemo, type FC } from "react";
import { useGetNoteQuery } from "@notes/note.api";
import type { IImageOcclusionSerialized } from "../../../db/entities/imageOcclusion";
import { useInterval } from "../../hooks/useInterval";
import { getBlurValue } from "../../utils/getBlurValue";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMode } from "../../../List/list.selectors";
import { setListMode } from "../../../List/list.slice";
import type { INoteId } from "../../note.defs";

interface ImageOcclusionProps {
    id: string
}

export const ImageOcclusionNote: FC<ImageOcclusionProps> = ({id}) => {

    const {data: note, } = useGetNoteQuery(id)
    const { state: interval } = useInterval(id as INoteId)
    const currentMode = useAppSelector(selectMode)
    const dispatch = useAppDispatch()

    const ioNote = useMemo(() => note && note.kind === 'imageOcclusion' ? note as IImageOcclusionSerialized : null, [note])

    useEffect(() => {
        return () => {
            if(ioNote?.url) 
                URL.revokeObjectURL(ioNote.url)
        }
    }, [ioNote])

    const handleClick = () => {
        if(currentMode.kind === 'onAnswer' || currentMode.kind === 'showAll') return         
        dispatch(setListMode({kind: 'onAnswer', noteId: id})) 
    }

    const rectStyles = useMemo(() => ioNote ? ioNote.rects.map((rect): React.CSSProperties => ({
        position: 'absolute',
        // backgroundColor: "orange",
        backdropFilter: interval.kind === 'open' ? `blur(${getBlurValue(interval.passed)}px)` : 'none',
        backgroundColor: interval.kind === 'close' ? 'orange' : 'transparent',
        // maskImage: `linear-gradient(to bottom, black 0% 50%, transparent 50% 100%)`,
        left: `${rect.left}%`,
        top: `${rect.top}%`,
        width: `${(rect.width)}%`,
        height: `${(rect.height)}%`,
    })) : [], [ioNote, interval])

    if(!ioNote) return null

    return (
        <div 
            className="size-48 relative"
            onClick={handleClick}
        >
            <img src={ioNote?.url ?? ""} className="w-full object-contain"/>

            {rectStyles.map((rectStyle) => (
                <div 
                    style={rectStyle}
                />

            ))}
        </div>
    )
}