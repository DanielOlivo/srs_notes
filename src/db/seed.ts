import { Document } from "./Document"
import { BasicNote, TextNote } from "./entities/Note.utils"
import { getDb } from "./LocalDb"

export const seed = async () => {
    console.log('seeding...')
    const db = await getDb()

    const docs = [
        new Document("doc1", "list"),
        new Document("doc2", "list"),
        new Document("doc3", "list"),
    ]

    await db.createDocument(docs[0])
    await db.createDocument(docs[1])
    await db.createDocument(docs[2])

    const doc1BasicNotes = Array.from({length: 10}, () => BasicNote.random())    
    for(const note of doc1BasicNotes){
        try{
            await db.createListNote(docs[0].id, note)
        }
        catch(error){
            console.error(`failed to create note ${note}\n${error}`)
            break
        }
    }

    const docTextNotes = Array.from({length: 10}, () => TextNote.random())
    for(const note of docTextNotes){
        await db.createListNote(docs[0].id, note)
    }
    // await Promise.all(docTextNotes.map(async note => {
    //     await db.createListNote(docs[1].id, note)
    // }))

    console.log('..seeding done')
}