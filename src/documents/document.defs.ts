export type DocumentId = {
    docId: IDocId
}

export type IDocId = string & { readonly __brand: "DocId"}

export class DocId {
    static create = (id: string) => `doc_${id}` as IDocId
}