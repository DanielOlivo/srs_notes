import { v4 } from "uuid"
import { Document } from "./Document"
import { BasicNote, Interval, TextNote } from "./entities/Note.utils"
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
    for(const [idx, note] of doc1BasicNotes.entries()){
        try{
            await db.createListNote(docs[0].id, note)
            const interval = idx % 2 === 0 
                ? new Interval(v4(), note.id, 10000, Date.now())
                : new Interval(v4(), note.id, 900000000000, Date.now())
            await db.addInterval(interval)
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

    console.log('..seeding done')
}