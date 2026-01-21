export type NoteType = "basic" | "text" | "image"

export interface BaseNote {
    id: string
    createdAt: number
    updatedAt: number
}

export interface BasicNote extends BaseNote {
    kind: 'basic'
    front: string
    back: string
}

export interface TextNote extends BaseNote {
    kind: 'text'
    text: string
}

export interface ImageNote extends BaseNote {
    kind: 'image'
    name: string
    data: Blob
}

export type Note = BasicNote | TextNote | ImageNote

export const storeName = "noteStore"

/**
 * @deprecated Do not use: idb doesn't recoginise union discriminations
 */
export interface NoteDb {
    [storeName]: {
        key: string,
        value: Note,
        indexes: {
            "by-type": NoteType
        }
    }
}

export const basicNoteStoreName = "basicNoteStore"
export const textNoteStoreName = "textNoteStore"
export const imageNoteStoreName = "imageNoteStore"

export interface BasicNoteDb {
    [basicNoteStoreName]: {
        key: string,
        value: BasicNote,
    }
}

export interface TextNoteDb {
    [textNoteStoreName]: {
        key: string,
        value: TextNote,
    }
}

export interface ImageNoteDb {
    [imageNoteStoreName]: {
        key: string,
        value: ImageNote,
    }
}

export function isBasicNote(note: Note): note is BasicNote {
    return note.kind === "basic"
}

export function isTextNote(note: Note): note is TextNote {
    return note.kind === "text"
}

export function isImageNote(note: Note): note is ImageNote {
    return note.kind === "image"
}
