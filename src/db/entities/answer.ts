import { parse } from 'papaparse'

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

    asPlain = (): IAnswer => ({
        id: this.id,
        noteId: this.noteId,
        answer: this.answer,
        timestamp: this.timestamp
    })

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