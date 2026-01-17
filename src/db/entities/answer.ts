import type { Ease } from "../../Game/Ease"

export interface Answer {
    id: string
    noteId: string
    answer: Ease
    timestamp: number
}

export const storeName = "answers"

export interface AnswerDb {
    [storeName]: {
        key: string,
        value: Answer
        indexes: {
            "by-noteId": string,
        }
    }
}