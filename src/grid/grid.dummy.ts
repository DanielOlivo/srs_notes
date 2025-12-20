import { v4 } from "uuid";
import type { GridNoteConfig } from "../db/LocalDb";
import type { BasicNoteDto } from "../notes/notes.dto";
import type { GridNoteConfigDto } from "./grid.dto";

export const dummyNotes: BasicNoteDto[] = Array.from({length: 3}, (_, i) => ({
    id: i.toString(),
    front: `front ${i}`,
    back: `back ${i}`,
    createdAt: Date.now(),
    updatedAt: Date.now()
}))

export const dummyNoteConfigs: GridNoteConfigDto[] = Array.from({length: 3}, (_, i) => ({
    id: v4(),
    noteId: i.toString(),
    gridId: "",
    currentOpenInterval: 10000,
    lastOpenTimestamp: Date.now()
}))