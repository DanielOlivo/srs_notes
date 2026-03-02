import type { Ease } from "../Game/Ease"

export type WordsRequest = {
    term: string
}

export type AnswerRequest = {
    itemId: string
    ease: Ease
}