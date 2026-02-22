import type { FC } from "react";
import type { NoteIdProp } from "../../note.defs";

type TextProp = {
    text: string 
}

export const ClozeNote: FC<NoteIdProp & TextProp> = ({noteId, text}) => {
    return text;
}