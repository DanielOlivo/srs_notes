// import type { Document } from "../../db/LocalDb";
// import type { DocumentDto, DocumentInfoDto } from "../../documents/document.dto";

// export const documentMappers = {

//     documentToDocumentInfoDto(doc: Document): DocumentInfoDto {
//         return {
//             hash: doc.hash,
//             name: doc.name,
//             uploadedAt: doc.uploadedAt,
//             size: doc.data.size
//         }
//     },

//     documentToDocumentDto(doc: Document): DocumentDto {
//         return {
//             ...this.documentToDocumentInfoDto(doc),
//             data: doc.data
//         }

//     }

// }