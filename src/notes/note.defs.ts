export type NoteIdProp = {
    noteId: INoteId
}

export type INoteId = string & { readonly __brand: "NoteId"}

export class NoteId {
    static create = (id: string) => `note_${id}` as INoteId
}