import type { Decorator } from "@storybook/react";
import { AsyncWrapper } from "../utils/components/AsyncWrapper";
import type { IDocument } from "./entities/document";
import { getDb, withTx } from "./LocalDb";
import type { Note } from "./entities/Note";
import type { IPosition } from "./entities/position";
import { Document } from "./Document";

export const withIdb: Decorator = (Story, context) => {
    const { idb } = context.parameters

    if(!idb) return <Story />  

    return (
        <AsyncWrapper fn={() => proceedParams(idb)}>
            <Story />
        </AsyncWrapper>
    )
}

export type IdbParams = {
    documents: IDocument[],
    notes: Note[],
    positions: IPosition[]
}

export async function proceedParams(params: IdbParams): Promise<void>{
    const db = await getDb()

    const existing = (await withTx(
        ...params.documents.map(doc => Document.getTx(doc.id))
    )).filter(doc => doc !== null)

    if(existing.length > 0){
        await withTx(
            ...existing.map(doc => doc.removeTx)
        )
    }

    await withTx(
        ...params.documents.map(Document.from).map(doc => doc.addTx)
    )

    // for(const note of params.notes){
    //     const existing = await db.tryGetNoteById(note.id)
    //     const [ existingPosition ] = await db.getNotePositions([note.id])
    //     if(existing){
    //         await db.deleteNote(note.id)
    //     }
    //     if(existingPosition){
    //         await db.deletePosition(existingPosition.id)
    //     }
    //     const position = params.positions.find(p => p.noteId === note.id)
    //     if(!position){
    //         console.error(`failed to get position for note with id ${note.id}`)
    //         continue
    //     }
    //     await db.createListNote(position.documentId, note)
    // }
}
