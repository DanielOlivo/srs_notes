export interface IDocument {
    id: string
    name: string
    createdAt: number
    type: "list" | "grid"
}

export interface DocumentDb {
    documents: {
        key: string // id
        value: IDocument,
        indexes: {
            "by-name": string
        }
    }
}