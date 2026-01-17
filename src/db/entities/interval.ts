export interface Interval {
    id: string
    noteId: string
    openTimestamp: number // ms
    openDuration: number // ms
}

export const storeName = "intervals"

export interface IntervalDb {
    [storeName]: {
        key: string,
        value: Interval
        indexes: {
            "by-noteId": string,
        }
    }
}