import { useEffect, useEffectEvent, useMemo, useState, type FC } from "react";
import type { IVector2 } from "../../../utils/Vector2";
import { useGetIntervalQuery, useGetNoteQuery } from "../../note.api";
import type { IImageOcclusionSerialized } from "../../../db/entities/imageOcclusion";
import { useInterval } from "../../hooks/useInterval";
import { getBlurValue } from "../../utils/getBlurValue";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMode } from "../../../List/list.selectors";
import { setListMode } from "../../../List/list.slice";

type Rect = {
    topLeft: IVector2 // percentage
    bottomRight: IVector2 // percentage
}

const rects: Rect[] = [
    {
        topLeft: {x: 0.1, y: 0.1},
        bottomRight: {x: 0.3, y: 0.9}
    },
    {
        topLeft: {x: 0.4, y:0.1},
        bottomRight: {x: 1.0, y: 0.9}
    }
]

interface ImageOcclusionProps {
    id: string
}

export const ImageOcclusionNote: FC<ImageOcclusionProps> = ({id}) => {

    const {data: note, } = useGetNoteQuery(id)
    const { state: interval } = useInterval(id)
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