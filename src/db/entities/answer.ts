import { parse } from 'papaparse'
import { getLocalDb, type Tx } from '../LocalDb'
import type { IDBPDatabase } from 'idb'
import type { Db } from '../Db'

export type Ease = 'Again' | 'Hard' | 'Good' | 'Easy'

export interface IAnswer {
    id: string
    noteId: string
    answer: Ease
    timestamp: number
}

export const storeName = "answers"

export interface AnswerDb {
    [storeName]: {
        key: string,
        value: IAnswer
        indexes: {
            "by-noteId": string,
        }
    }
}

export class Answer implements IAnswer {
    id: string
    noteId: string
    answer: Ease
    timestamp: number

    constructor(id: string, noteId: string, answer: Ease, timestamp: number){
        this.id = id
        this.noteId = noteId
        this.answer = answer
        this.timestamp = timestamp
    }

    static createStore = (db: IDBPDatabase<Db>) => {
        const store = db.createObjectStore(storeName, {keyPath: "id"})
        store.createIndex("by-noteId", "noteId", {unique: false})
        return store
    }

    static from = (answer: IAnswer) => new Answer(
        answer.id,
        answer.noteId,
        answer.answer,
        answer.timestamp
    )

    static all = async () => {
        const db = await getLocalDb()
        const records = await db.getAll("answers")
        const answers = records.map(r => new Answer(
            r.id,
            r.noteId,
            r.answer,
            r.timestamp
        ))
        return answers
    }

    asPlain = (): IAnswer => ({
        id: this.id,
        noteId: this.noteId,
        answer: this.answer,
        timestamp: this.timestamp
    })

    create = async () => {
        const plain = this.asPlain()
        const db = await getLocalDb()
        await db.add("answers", plain)
    }

    addTx = async (tx: Tx) => { await tx.answerStore.add(this.asPlain()) }

    toCsvRow = ():string => `${this.id},${this.noteId},${this.answer},${this.timestamp}`

    static fromCsv(csv: string): Answer[] {
        const data = parse(csv)
        const records = data.data as string[][]
        const answers = records.map(row => {
            const [ id, noteId, answerStr, timestampStr ] = row
            return new Answer(
                id,
                noteId,
                answerStr as Ease,
                parseInt(timestampStr)
            )
        })
        return answers
    }
}