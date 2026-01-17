export interface Document {
    id: string
    name: string
    createdAt: number
    type: "list" | "grid"
}

export interface DocumentDb {
    documents: {
        key: string // id
        value: Document,
        indexes: {
            "by-name": string
        }
    }
}