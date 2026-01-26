export type NoteType = "basic" | "text" | "image"

export interface BaseNote {
    id: string
    createdAt: number
    updatedAt: number
}

export interface BasicNoteData {
    kind: 'basic'
    front: string
    back: string
}
export interface IBasicNote extends BaseNote, BasicNoteData {}


export interface TextNoteData {
    kind: 'text'
    text: string
}
export interface ITextNote extends BaseNote, TextNoteData {}


export interface ImageNoteData {
    kind: 'image'
    name: string
    data: Blob
}
export interface IImageNote extends BaseNote, ImageNoteData {}


export type NoteData = BasicNoteData | TextNoteData | ImageNoteData
export type Note = IBasicNote | ITextNote | IImageNote

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
        value: IBasicNote,
    }
}

export interface TextNoteDb {
    [textNoteStoreName]: {
        key: string,
        value: ITextNote,
    }
}

export interface ImageNoteDb {
    [imageNoteStoreName]: {
        key: string,
        value: IImageNote,
    }
}

export function isBasicNote(note: Note): note is IBasicNote {
    return note.kind === "basic"
}

export function isTextNote(note: Note): note is ITextNote {
    return note.kind === "text"
}

export function isImageNote(note: Note): note is IImageNote {
    return note.kind === "image"
}
