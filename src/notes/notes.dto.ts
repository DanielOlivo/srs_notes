import type { Note, NoteData } from "../db/entities/Note"
import type { Position } from "../db/entities/position"


export interface CreatebasicNoteDto {
    front: string     
    back: string
}

export interface UpdateNoteDto {
    id: string
    data: NoteData
}

export interface UpdateBasicNoteDto extends CreatebasicNoteDto {
    id: string
}

export interface DocNotesDto {
    notes: Note[]
    positions: Position[]
}



