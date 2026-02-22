import { useEffect, useMemo, useState, type FC } from "react";
import type { NoteIdProp } from "../../note.defs";
import { useInterval } from "../../hooks/useInterval";
import { getBlurValue } from "../../utils/getBlurValue";

type TextProp = {
    text: string 
}

type Segment = {
    type: "text" | "block"
    value: string 
    inner?: string
}

const parseText = (text: string) => {
    const reg = /(\{\{(.*?)\}\})/g;
    const result: Segment[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while((match = reg.exec(text)) !== null) {
        const [full, rawBlock, inner] = match
        if(match.index > lastIndex){
            result.push({
                type: 'text',
                value: text.slice(lastIndex, match.index)
            })
        }
        result.push({
            type: "block",
            value: rawBlock,
            inner
        })
        lastIndex = reg.lastIndex
    }

    if(lastIndex < text.length){
        result.push({
            type: 'text',
            value: text.slice(lastIndex)
        })
    }

    return result
}

export const ClozeNote: FC<NoteIdProp & TextProp> = ({noteId, text}) => {

    const { state } = useInterval(noteId)
    const segments = useMemo(() => parseText(text), [text])
    return (
        <div>
            <div>
                {segments.map(seg => 
                    seg.type === 'text'
                    ? <span>{seg.value}</span>
                    : state.kind !== 'open' 
                    ? 
                    <span 
                        className="text-blue-500 text-2xl"
                    >...</span>
                    : <span
                        style={{
                            filter: `blur(${getBlurValue( state.passed )})`,
                            color: "var(--color-blue-500)"
                        }}
                    >{seg.inner}</span>
                )}
            </div>
        </div>
    );
}