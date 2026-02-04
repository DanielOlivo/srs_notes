import type { Ease } from "../db/entities/answer"
import type { Note, NoteData } from "../db/entities/Note"
import type { IPosition } from "../db/entities/position"


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

export interface CreateNote {
    data: NoteData
    docId: string
}

export interface DocNotesDto {
    notes: Note[]
    positions: IPosition[]
}

export interface AnswerReqDto {
    noteId: string
    ease: Ease
}

