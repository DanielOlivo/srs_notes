import type { FC } from "react";
import type { ITextNote as TextNoteRecord } from "../../../db/entities/Note";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectMode } from "../../../List/list.selectors";
import { setListMode, type ListMode2 } from "../../../List/list.slice";

export const TextNote: FC<TextNoteRecord> = ({id, text}) => {

    const mode = useAppSelector(selectMode)
    const dispatch = useAppDispatch()

    const handleClick = () => {
        const modes: ListMode2['kind'][] = ['edit', 'onUpdate', 'new']
        if(modes.some(m => m === mode.kind))
            dispatch(setListMode({kind: 'onUpdate', noteId: id}))
    }

    return (
        <div 
            className="w-full h-full flex justify-center items-center"
            onClick={handleClick}
        >
            <span>{text}</span>
        </div>
    )
}