import type { DBSchema } from "idb";
import type { DocumentDb } from "./entities/document";
import type { PositionDb } from "./entities/position";
import type { BasicNoteDb, ImageNoteDb, NoteDb, TextNoteDb } from "./entities/Note";
import type { AnswerDb } from "./entities/answer";
import type { IntervalDb } from "./entities/interval";
import type { ScrollPositionDb } from "./entities/scrollPosition";
import type { DeletedDocDb } from "./entities/deletedDoc";

export interface Db extends 
    DBSchema, DocumentDb, PositionDb,
    // NoteDb, 
    BasicNoteDb, TextNoteDb, ImageNoteDb,
    AnswerDb, IntervalDb,
    DeletedDocDb,
    ScrollPositionDb
    {}