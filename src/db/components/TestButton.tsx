import type { FC } from "react";
import { Document } from "../Document";
import { getDb } from "../LocalDb";
import { BasicNote, TextNote } from "../entities/Note.utils";

export const TestButton: FC = () => {
    return (
        <button
            className="btn btn-accent"
            onClick={test}
        >Test</button>
    )
}

const test = async () => {
    console.log('test...')
    const db = await getDb()

    try{
        console.log('document crud...')

        const doc = new Document("doc",'list')
        db.createDocument(doc)

        {
            // get
            const extracted = await db.getDocumentById(doc.id)
            if(!extracted)
                throw new Error('failed to get document')
        }
    
        {
            // update
            const newName = "doc2"
            await db.updateDocumentName(doc.id, newName)

            const extracted = await db.getDocumentById(doc.id)
            if(extracted!.name !== newName)
                throw new Error('doc name was not updated')

            const extracted2 = await db.getDocumentByName(newName)
            if(!extracted2)
                throw new Error('failed to get document by name')
        }

        // delete
        await db.removeDocument(doc.id)

        console.log('...document crud done')
    }
    catch(err){
        console.error(err)
    }
    
    const doc = new Document("doc", 'list')
    await db.createDocument(doc)

    try{
        console.log('basic note crud...') 

        const basic = BasicNote.random()

        {
            // create
            await db.createListNote(doc.id, basic)

            // get
            const note = await db.getNoteById(basic.id)
            if(!note){
                throw new Error('failed to get note')
            }
        }

        {
            // update
            basic.back = "changed back"
            await db.updateNote(basic)

            const extracted = await db.getNoteById(basic.id)
            if(!extracted) throw new Error('failed to get note by id')
            if((extracted as BasicNote).back !== basic.back) throw new Error("note back was not updated")
        }

        {
            // delete
            await db.deleteNote(basic.id, basic.kind)

            const nonexisting = await db.getNoteById(basic.id)
            if(nonexisting)
                throw new Error("note was not deleted")
        }
        
        console.log('...basic note crud done')
    }
    catch(error){
        console.error(error)
    }

    try {
        console.log('text note...')
        const text = TextNote.random()
        await db.createListNote(doc.id, text)

        {
            // get
            const extracted = await db.getNoteById(text.id)
            if(!extracted) throw new Error('failed to get note')
        }

        {
            // update
            text.text = "some new content"
            await db.updateNote(text)

            const extracted = await db.getNoteById(text.id)
            if(!extracted) throw new Error('failed to get note by id')
            if((extracted as TextNote).text !== text.text) throw new Error("note text was not updated")
        }

        {
            // delete
            await db.deleteNote(text.id, text.kind)

            const nonexisting = await db.getNoteById(text.id)
            if(nonexisting)
                throw new Error("note was not deleted")
        }
        console.log('...text note done')
    }
    catch(error){
        console.error(error)
    }

    console.log('...done')
}