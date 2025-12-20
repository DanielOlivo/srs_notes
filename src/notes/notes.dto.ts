export interface CreatebasicNoteDto {
    front: string     
    back: string
}

export interface UpdateBasicNoteDto extends CreatebasicNoteDto {
    id: string
}

export interface NoteDto {
    id: string
    kind: 'basic' | 'text' | 'image'
    createdAt: number
    updatedAt: number | null
}

export interface BasicNoteDto extends NoteDto {
    kind: 'basic',
    front: string
    back: string
}

export interface TextNoteDto extends NoteDto {
    kind: 'text'
    text: string
}

export interface ImageNoteDto extends NoteDto {
    kind: 'image'
    src: string
}

export interface NoteListDto {
    notes: BasicNoteDto[]
}

export function isBasicNoteDto(note: NoteDto): note is BasicNoteDto {
    return note.kind === 'basic'
}

export function isTextNoteDto(note: NoteDto): note is TextNoteDto {
    return note.kind === 'text'
}

export function isImageNoteDto(note: NoteDto): note is ImageNoteDto {
    return note.kind === 'image'
}

