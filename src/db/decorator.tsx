import type { Decorator } from "@storybook/react";
import { AsyncWrapper } from "../utils/components/AsyncWrapper";
import type { IDocument } from "./entities/document";
import { getDb } from "./LocalDb";
import type { Note } from "./entities/Note";
import type { IPosition } from "./entities/position";

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

    for(const document of params.documents){
        const existingDoc = await db.getDocumentById(document.id)
        if(existingDoc){
            await db.removeDocument(document.id)
        }
        await db.createDocument(document)
    }

    for(const note of params.notes){
        const existing = await db.tryGetNoteById(note.id)
        const [ existingPosition ] = await db.getNotePositions([note.id])
        if(existing){
            await db.deleteNote(note.id)
        }
        if(existingPosition){
            await db.deletePosition(existingPosition.id)
        }
        const position = params.positions.find(p => p.noteId === note.id)
        if(!position){
            console.error(`failed to get position for note with id ${note.id}`)
            continue
        }
        await db.createListNote(position.documentId, note)
    }
}
