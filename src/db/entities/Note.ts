export type NoteType = "basic" | "text" | "image"

export interface Note {
    id: string
    type: NoteType
    createdAt: number
    updatedAt: number
}

export interface BasicNote extends Note {
    front: string
    back: string
}

export interface TextNote extends Note {
    text: string
}

export interface ImageNote extends Note {
    name: string
    data: Blob
}

export const storeName = "noteStore"

export interface NoteDb {
    [storeName]: {
        key: string,
        value: Note,
        indexes: {
            "by-type": NoteType
        }
    }
}

export function isBasicNote(note: Note): note is BasicNote {
    return note.type === "basic"
}

export function isTextNote(note: Note): note is TextNote {
    return note.type === "text"
}

export function isImageNote(note: Note): note is ImageNote {
    return note.type === "image"
}
