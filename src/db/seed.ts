import { v4 } from "uuid";
import { getDb, type Grid, type Note, type Position } from "./LocalDb";

export async function seed() {
    // skip documents

    // notes
    const notes = Array.from({length: 30}, (_, i): Note => ({
        id: v4(),
        front: `front ${i}`,
        back: `back ${i}`,
        createdAt: Date.now(),
        updatedAt: Date.now() 
    }))

    const grids: Grid[] = [{
        id: v4(),
        name: "grid 1",
        createdAt: Date.now()
    }]

    const positions: Position[] = notes.map((note, i) => ({
        id: i,
        noteId: note.id,
        gridId: grids[0].id,
        coord: {
            x: i % 5,
            y: Math.floor(i / 5)
        }
    }))

    const db = await getDb()
     
    await Promise.all([
        ...notes.map(note => db.createNote(note.front, note.back)),
        ...grids.map(grid => db.createGrid(grid.name)),
        ...positions.map(pos => db.addNoteToGrid(pos.gridId, pos.noteId, pos.coord))
    ])
}