import type { DBSchema } from "idb";
import type { DocumentDb } from "./entities/document";
import type { PositionDb } from "./entities/position";
import type { NoteDb } from "./entities/Note";
import type { AnswerDb } from "./entities/answer";
import type { IntervalDb } from "./entities/interval";

export interface Db extends 
    DBSchema, DocumentDb, PositionDb,
    NoteDb, AnswerDb, IntervalDb
    {}