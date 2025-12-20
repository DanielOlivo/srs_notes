import type { DocumentInfoDto } from "../documents/document.dto";
import type { Document } from "./LocalDb";

export function toDocumentInfoDto(document: Document): DocumentInfoDto {
    return {
        hash: document.hash,
        name: document.name,
        uploadedAt: document.uploadedAt,
        size: document.data.size
    }
}
