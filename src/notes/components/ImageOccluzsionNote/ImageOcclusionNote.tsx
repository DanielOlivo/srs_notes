import { useEffect, useEffectEvent, useMemo, useState, type FC } from "react";
import type { IVector2 } from "../../../utils/Vector2";

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

export const ImageOcclusionNote: FC = () => {

    const [url, _setUrl] = useState<string | null>(null)
    const setUrl = useEffectEvent(_setUrl)

    useEffect(() => {
        fetch("/image.png")
            .then(res => res.blob())
            .then(blob => setUrl(URL.createObjectURL(blob)))
    }, [])

    const rectStyles = useMemo(() => rects.map((rect): React.CSSProperties => ({
        position: 'absolute',
        // backgroundColor: "orange",
        backdropFilter: `blur(3px)`,
        // maskImage: `linear-gradient(to bottom, black 0% 50%, transparent 50% 100%)`,
        left: `${rect.topLeft.x * 100}%`,
        top: `${rect.topLeft.y * 100}%`,
        width: `${(rect.bottomRight.x - rect.topLeft.x) * 100}%`,
        height: `${(rect.bottomRight.y - rect.topLeft.y) * 100}%`,
    })), [])

    if(!url) return null

    return (
        <div className="size-48 relative">
            <img src={url} className="w-full object-contain"/>

            {rectStyles.map((rectStyle) => (
                <div 
                    style={rectStyle}
                />

            ))}
        </div>
    )
}