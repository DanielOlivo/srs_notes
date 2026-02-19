import type { IBaseNote } from "./Note";


export interface ImageNoteData {
    kind: 'image'
    name: string
    data: Blob
}

export interface IImageNote extends IBaseNote, ImageNoteData {}

export const storeName = "imageNoteStore"

export interface ImageNoteDb {
    [storeName]: {
        key: string,
        value: IImageNote
    }
}

// export class ImageNote extends BaseNote implements IImageNote {

//     kind: 'image'
//     name: string
//     data: Blob

//     constructor(id: string, createdAt: number, updatedAt: number, name: string, data: Blob){
//         super(id, createdAt, updatedAt)
//         this.name = name
//         this.data = data
//         this.kind = 'image'
//     }

//     static from = (note: IImageNote): ImageNote => new ImageNote(
//         note.id,
//         note.createdAt,
//         note.updatedAt,
//         note.name,
//         note.data
//     )

//     static random = async () => {
//         const imageUrl = faker.image.urlPicsumPhotos()
//         const res = await fetch(imageUrl)
//         const blob = await res.blob()
//         const uri = URL.createObjectURL(blob)
//         return new ImageNote(
//             faker.string.uuid(),
//             Date.now(),
//             Date.now(),
//             uri,
//             blob
//         )
//     }

//     asPlain = (): IImageNote => ({
//         id: this.id,
//         kind: "image",
//         createdAt: this.createdAt,
//         updatedAt: this.updatedAt,
//         name: this.name,
//         data: this.data
//     })

//     static getTx = (id: string) => async (tx: Tx): Promise<ImageNote | null> => {
//         const record = await tx.imageNoteStore.get(id)
//         if(!record) return null
//         return ImageNote.from(record)
//     }

//     addTx = async (tx: Tx) => {
//         await tx.imageNoteStore.add(this.asPlain())
//     }
// }

