import type { Ease } from "../Game/Ease";
import { type GridItem } from "./GridItem";

export interface TwoSide extends GridItem {
    front: string
    back: string
    createdAt: number
    lastAnswerTimestamp: number
    memInterval: number
}

export interface AnswerHistory {
    itemId: string
    timestamp: number
    answer: Ease
}