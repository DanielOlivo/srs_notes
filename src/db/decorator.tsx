import type { Decorator } from "@storybook/react";
import { AsyncWrapper } from "../utils/components/AsyncWrapper";
import type { Document } from "./entities/document";
import { getDb } from "./LocalDb";

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
    documents: Document[]
}

async function proceedParams(params: IdbParams): Promise<void>{
    const db = await getDb()
    for(const document of params.documents){
        const existingDoc = await db.getDocumentById(document.id)
        if(existingDoc){
            await db.removeDocument(document.id)
        }
        await db.createDocument(document)
    }
}
