import type { Rect } from "../../common/entities/Rect"
import { getLocalDb, type Tx } from "../LocalDb"
import type { IBaseNote } from "./Note"
import { BaseNote } from "./Note.utils"


export interface ImageOcclusionData {
    kind: "imageOcclusion"
    blob: Blob
    rects: Rect[]
}


export interface IImageOcclusionNote extends IBaseNote, ImageOcclusionData {}

export type IImageOcclusionSerialized = Omit<IImageOcclusionNote, "blob"> & { url: string }

export const imageOcclusionStoreName = "imageOcclusionStore"

export interface imageOcclusionDb {
    [imageOcclusionStoreName]: {
        key: string
        value: IImageOcclusionNote
    }
}

export class ImageOcclusion extends BaseNote implements IImageOcclusionNote {
    kind: IImageOcclusionNote["kind"]
    blob: Blob
    rects: Rect[]

    constructor(id: string, createdAt: number, updatedAt: number, blob: Blob, rects: Rect[]){
        super(id, createdAt, updatedAt)
        this.blob = blob
        this.rects = rects
        this.kind = "imageOcclusion"
    }

    static from = (record: IImageOcclusionNote) => new ImageOcclusion(
        record.id,
        record.createdAt,
        record.updatedAt,
        record.blob,
        record.rects
    )

    asPlain = (): IImageOcclusionNote => {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            kind: this.kind,
            rects: this.rects,
            blob: this.blob
        }
    } 

    serializable = (): IImageOcclusionSerialized => {
        const url = URL.createObjectURL(this.blob)
        const { blob: _, ...rest } = this.asPlain()
        return { url, ...rest}
    }

    static getTx = (id: string) => async (tx: Tx) => {
        const record = await tx.imageOcclusionStore.get(id)
        return record ? ImageOcclusion.from(record) : null
    }

    addTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.add(this.asPlain())
    }

    update = async () => {
        const db = await getLocalDb()
        await db.put(imageOcclusionStoreName, this.asPlain())
    }

    updateTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.put(this.asPlain())
    }

    deleteTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.delete(this.id)
    }

    // csv later
}