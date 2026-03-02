import type { DBSchema } from "idb";
import type { DocumentDb } from "./entities/document";
import type { PositionDb } from "./entities/position";
import type { BasicNoteDb, TextNoteDb } from "./entities/Note";
import type { AnswerDb } from "./entities/answer";
import type { IntervalDb } from "./entities/interval";
import type { ScrollPositionDb } from "./entities/scrollPosition";
import type { DeletedDocDb } from "./entities/deletedDoc";
import type { DeletedNoteDb } from "./entities/deletedNote";
import type { ImageNoteDb } from "./entities/ImageNote";
import type { DocumentConfigDb } from "./entities/documentConfig";
import type { ClozeNoteDb } from "./entities/cloze";
import type { imageOcclusionDb } from "./entities/imageOcclusion";

export interface Db extends 
    DBSchema, DocumentDb, PositionDb,
    // NoteDb, 
    BasicNoteDb, TextNoteDb, ImageNoteDb, ClozeNoteDb, imageOcclusionDb,
    AnswerDb, IntervalDb,
    DeletedDocDb, DeletedNoteDb,
    ScrollPositionDb,
    DocumentConfigDb
    {}