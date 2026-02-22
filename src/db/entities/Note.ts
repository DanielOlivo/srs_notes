import type { ClozeNoteData, IClozeNote } from "./cloze"
import type { IImageNote, ImageNoteData } from "./ImageNote"

export type NoteType = "basic" | "text" | "image"

export interface IBaseNote {
    id: string
    createdAt: number
    updatedAt: number
}

export interface BasicNoteData {
    kind: 'basic'
    front: string
    back: string
}
export interface IBasicNote extends IBaseNote, BasicNoteData {}


export interface TextNoteData {
    kind: 'text'
    text: string
}
export interface ITextNote extends IBaseNote, TextNoteData {}

export type NoteData = BasicNoteData | TextNoteData | ImageNoteData | ClozeNoteData
export type Note = IBasicNote | ITextNote | IClozeNote | Omit<IImageNote, "data">

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

export function isBasicNote(note: Note): note is IBasicNote {
    return note.kind === "basic"
}

export function isTextNote(note: Note): note is ITextNote {
    return note.kind === "text"
}

export function isImageNote(note: Note): note is IImageNote {
    return note.kind === "image"
}
