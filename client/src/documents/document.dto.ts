import type { Document } from "../db/Document"

export interface DocumentInfoDto {
    hash: string
    name: string
    uploadedAt: Date
    size: number
}

export interface CreateDocumentRequestDto {
    name: string
    type: Document['type']
}

export interface DocumentDto extends DocumentInfoDto {
    data: Blob
}

export interface DocumentListDto {
    documents: DocumentInfoDto[]
}

export interface DocumentRenameRequestDto {
    id: string
    newName: string
}