import { useState, type FC } from "react";
import type { NoteIdProp } from "../../note.defs";

type TextProp = {
    text: string 
}

type Segement = {
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

    const [_text, setText] = useState("")
    const [segments, setSegments] = useState<Segement[]>([])

    return (
        <div>
            <textarea
                onChange={e => setText(e.target.value)} 
            />

            <button onClick={() => setSegments(parseText(_text))}>Check</button>

            <div>
                {segments.map(seg => 
                    seg.type === 'text'
                    ? <span>{seg.value}</span>
                    : <span className="text-blue-500 blur-sm">{seg.inner}</span>
                )}
            </div>
        </div>
    );
}