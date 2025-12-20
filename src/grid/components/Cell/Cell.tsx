import { useMemo, useState, type FC, type ReactNode } from "react";
import type { Coord } from "../../../utils/Coord";
import { useGetNoteAtCoordQuery } from "../../grid.api";
import { BasicNote } from "../../../notes/components/BasicNote/BasicNote";
// import { useGridState } from "./Grid/Grid";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentMode } from "../../grid.selectors";
import { isBasicNoteDto, isImageNoteDto, isTextNoteDto, type NoteDto } from "../../../notes/notes.dto";
import { TextNote } from "../../../notes/components/TextNote/TextNote";
import { NotImplemented } from "../../../utils/NotImplemented";
import { ImageNote } from "../../../notes/components/ImageNote/ImageNote";
import { isEditMode, setIsOver, setOnMoving } from "../../grid.slice";

export interface CellProps {
    coord: Coord
    gridId: string
    cellSize: {
        width: number
        height: number
    }
    gap: number
}

const handleNote = (note: NoteDto, gridId: string): ReactNode => {
    if(isBasicNoteDto(note)) return (
        <BasicNote note={note} gridId={gridId} />
    )
    if(isTextNoteDto(note)) return (
        <TextNote id={note.id} text={note.text} />
    )
    if(isImageNoteDto(note)) return (
        <ImageNote id={note.id} src={note.src} />
    )
    throw new NotImplemented()
}

export const Cell: FC<CellProps> = ({coord, gridId, cellSize, gap}) => {

    const dispatch = useAppDispatch()
    const currentMode = useAppSelector(selectCurrentMode)

    const { data: noteOrNull,  isLoading, isError } = useGetNoteAtCoordQuery({coord, gridId})

    const [state, setState] = useState({
        isMoving: false,
        // The position of the cell inside its parent
        position: { x: 0, y: 0},
        // The starting position of the mouse when dragging begins
        dragStart: { x: 0, y: 0 }
    })

    const style = useMemo((): React.CSSProperties => {
        const initialLeft = coord.x * (cellSize.width + gap);
        const initialTop = coord.y * (cellSize.height + gap);
        return {
            width: `${cellSize.width}px`,
            height: `${cellSize.height}px`,
            left: state.isMoving ? `${state.position.x}px` : `${initialLeft}px`,
            top: state.isMoving ? `${state.position.y}px` :  `${initialTop}px`,
        }
    }, [coord, cellSize, gap, state.position, state.isMoving])

    const handleClick = () => {
        if(!isEditMode(currentMode)) return
    }

    const handleHandlerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if(isEditMode(currentMode)){
            e.stopPropagation();
            // dispatch(setOnMoving(coord))
            // const initialLeft = coord.x * (cellSize.width + gap);
            // const initialTop = coord.y * (cellSize.height + gap);
            // setState({
            //     ...state,
            //     isMoving: true,
            //     position: { x: initialLeft, y: initialTop },
            //     dragStart: { x: e.clientX, y: e.clientY }
            // })
        }
    }

    const handleHandlerMouseEnter = () => {
        if(isEditMode(currentMode) && currentMode.onMoving === null){
            dispatch(setIsOver(coord))
        }
    }

    const handleHandlerMouseLeave = () => {
        if(isEditMode(currentMode) && currentMode.onMoving === null){
            dispatch(setIsOver(null))
        }
    }

    const handleHandlerMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if(isEditMode(currentMode) && state.isMoving){
            e.stopPropagation();
            setState({
                ...state,
                isMoving: false,
            })
        }
    }

    const handleHandlerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if(isEditMode(currentMode) && state.isMoving){
            e.stopPropagation();
            const initialLeft = coord.x * (cellSize.width + gap);
            const initialTop = coord.y * (cellSize.height + gap);
            setState({
                ...state,
                position: {
                    x: initialLeft + (e.clientX - state.dragStart.x),
                    y: initialTop + (e.clientY - state.dragStart.y)
                }
            })
        }
    }

    // const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    //     if(isEditMode(currentMode) && state.isMoving){
    //         e.stopPropagation();
    //         setState({
    //             ...state,
    //             isMoving: false,
    //         })
    //     }
    // }

    const noteIsNullAndEditMode = noteOrNull === null && currentMode.kind === 'edit'
    const noteIsNullAndNonEditMode = noteOrNull === null && currentMode.kind !== 'edit'

    return (
        <div 
            style={style}
            className={`absolute m-0 flex justify-center items-center rounded-sm
                ${isEditMode(currentMode) && currentMode.selected ? "bg-blue-400 hover:bg-blue-200" : "bg-slate-200 hover:bg-slate-300"} 
                ${state.isMoving ? "z-20" : "z-10"}
            `}
            onClick={handleClick}
        >
            {
                isLoading ? <span>Loading</span>
                : isError || noteOrNull === undefined ? <span>Error</span>
                : noteIsNullAndEditMode ? <button className="text-8xl">+</button>
                : noteIsNullAndNonEditMode ? null
                : noteOrNull === null ? null
                : handleNote(noteOrNull, gridId)
            }

            {isEditMode(currentMode) && (
                <div 
                    className="absolute w-10 h-10 bg-green-500 top-0 right-0 select-none" 
                    onMouseEnter={handleHandlerMouseEnter}
                    onMouseLeave={handleHandlerMouseLeave}
                    // onMouseDown={handleHandlerMouseDown}
                    // onMouseMove={handleHandlerMouseMove}
                    // onMouseUp={handleHandlerMouseUp}
                    // onMouseLeave={handleMouseLeave}
                />
            )}
        </div>
    );
}