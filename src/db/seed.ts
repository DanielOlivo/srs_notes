import { v4 } from "uuid"
import { Document } from "./Document"
import { BasicNote, ImageNote, Interval, TextNote } from "./entities/Note.utils"
import { withTx } from "./LocalDb"
import { Position } from "./entities/position"
// import { ImageNote } from "./entities/ImageNote"

export const seed = async () => {
    console.log('seeding...')

    const docs = [
        new Document("doc1", "list"),
        new Document("doc2", "list"),
        new Document("doc3", "list"),
    ]

    const doc1BasicNotes = Array.from({length: 10}, () => BasicNote.random())    
    const intervals = doc1BasicNotes.map((note, idx) => new Interval(
        v4(),
        note.id,
        idx % 2 === 0 ? 10000 : 9000000,
        Date.now()
    ))
    const textNotes = Array.from({length: 10}, () => TextNote.random())

    const doc1Positions = [
        ...doc1BasicNotes,
        ...textNotes
        ].map((note, idx) => new Position(
            0,
            note.id,
            docs[0].id,
            {x: 0, y: idx}
        ))

    const randomImages = await Promise.all(
        Array.from({length: 3}, ImageNote.random)
    )

    const imageNotePositions = randomImages.map((ri, idx) => new Position(
        0,
        ri.id,
        docs[1].id,
        {x: 0, y: idx}
    ))

    await withTx(
        ...docs.map(doc => doc.addTx),
        ...doc1BasicNotes.map(note => note.addTx),
        ...textNotes.map(note => note.addTx),
        ...doc1Positions.map(pos => pos.addTx),
        ...intervals.map(interval => interval.addTx),

        // image
        ...randomImages.map(i => i.addTx),
        ...imageNotePositions.map(p => p.addTx)
    )

    console.log('..seeding done')
}