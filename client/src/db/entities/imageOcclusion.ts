import { v4 } from "uuid"
import { Rect, type IRect } from "../../common/entities/Rect"
import { getLocalDb, type Tx } from "../LocalDb"
import type { IBaseNote } from "./Note"
import { BaseNote } from "./Note.utils"
import { faker } from "@faker-js/faker"
import type { Db } from "../Db"
import type { IDBPDatabase } from "idb"


export interface ImageOcclusionData {
    kind: "imageOcclusion"
    blob: Blob
    rects: IRect[]
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
    rects: IRect[]

    constructor(id: string, createdAt: number, updatedAt: number, blob: Blob, rects: IRect[]){
        super(id, createdAt, updatedAt)
        this.blob = blob
        this.rects = rects
        this.kind = "imageOcclusion"
    }

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(imageOcclusionStoreName, {keyPath: "id"})
        return store
    }

    static from = (record: IImageOcclusionNote) => new ImageOcclusion(
        record.id,
        record.createdAt,
        record.updatedAt,
        record.blob,
        record.rects
    )

    static with = (blob: Blob, rects: IRect[]) => new ImageOcclusion(
        v4(),
        Date.now(),
        Date.now(),
        blob,
        rects
    )

    static random = async () => {
        // const url = faker.image.url()
        const url = "vite.svg"
        const response = await fetch(url)
        const blob = await response.blob()
        const randomRect = Rect.random()
        return ImageOcclusion.with(blob, [ randomRect ])
    }

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

    static get = async (id: string) => {
        const db = await getLocalDb()
        const record = await db.get(imageOcclusionStoreName, id)
        return record ? ImageOcclusion.from(record) : null
    }

    static getTx = (id: string) => async (tx: Tx) => {
        const record = await tx.imageOcclusionStore.get(id)
        return record ? ImageOcclusion.from(record) : null
    }

    add = async () => {
        const db = await getLocalDb()
        await db.add(imageOcclusionStoreName, this.asPlain())
    }

    addTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.add(this.asPlain())
    }

    update = async () => {
        const db = await getLocalDb()
        this.updatedAt = Date.now()
        await db.put(imageOcclusionStoreName, this.asPlain())
    }

    updateTx = async (tx: Tx) => {
        this.updatedAt = Date.now()
        await tx.imageOcclusionStore.put(this.asPlain())
    }

    remove = async () => {
        const db = await getLocalDb()
        await db.delete('imageOcclusionStore', this.id)
    }

    removeTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.delete(this.id)
    }

    deleteTx = async (tx: Tx) => {
        await tx.imageOcclusionStore.delete(this.id)
    }

    // csv later
}