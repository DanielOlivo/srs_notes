import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Quantity } from "./Quantity";
import type { Person } from "./Person";
import type { Tense } from "./Tense";
import { getDb } from "../db/LocalDb";



export const loadWords = createAsyncThunk(
    "words/loadWords",
    async () => {
        const db = await getDb();

        // const tx = db.transaction("words", "readwrite");
        // const records = getRandomRecords();
        // await Promise.all([...records.map(r => tx.store.add(r)), tx.done]); 
        throw new Error();
    }
)


export const clearWords = createAsyncThunk(
    "words/clearWords",
    async () => {
        const db = await getDb();
        throw new Error();
        // const tx = db.transaction("words", "readwrite");
        // await Promise.all([tx.store.clear(), tx.done]);
    }
)

export const getWords = createAsyncThunk(
    "words/getWords",
    async () => {
        const db = await getDb();
        // return await db.getAll("words") as TestRecord[];
        throw new Error();
    }
)





type Word = {
    menukad: string
    chaser: string
    transcription: string
    meaning: string
    genMeaning: string
    term: number
}

type WithRoot = { root: string }

type Form = {
    quantity?: Quantity;
    ownerQuantity?: Quantity
    person?: Person
}

type VerbState = {
    tense: Tense
}

type Adverb = { part: 'adverb' } & Word & WithRoot
