import type { Ease } from "../../Game/Ease"

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