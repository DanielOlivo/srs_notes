import { Document } from "./Document"
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

    console.log('..seeding done')

}