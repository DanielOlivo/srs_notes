import { createContext, useContext } from "react"
import type { NoteType } from "./noteTypes"

interface NoteCreate {
    noteType: NoteType
    setNoteType: (noteType: NoteType) => void
}

export function getInitState(): NoteCreate {

    const initState: NoteCreate = { 
        noteType: "basic",
        setNoteType: () => {} // dummy
    }

    initState.setNoteType = (type) => { initState.noteType = type }

    return initState
}

export const NoteCreateContext = createContext<NoteCreate>(getInitState())

export const useGetNoteCreate = () => useContext(NoteCreateContext);