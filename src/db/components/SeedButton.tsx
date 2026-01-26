import type { FC } from "react";
import { getDb } from "../LocalDb";
import { Document } from "../Document";

const seed = async () => {
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

export const SeedButton: FC = () => {

    return (
        <button
            className="btn btn-accent" 
            onClick={seed}
        >Seed</button>
    )
}