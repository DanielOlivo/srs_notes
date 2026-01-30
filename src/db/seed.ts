import { Document } from "./Document"
import { BasicNote } from "./entities/Note.utils"
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

    console.log('..seeding done')
}