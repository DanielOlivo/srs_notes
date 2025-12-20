export interface DocumentInfoDto {
    hash: string
    name: string
    uploadedAt: Date
    size: number
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