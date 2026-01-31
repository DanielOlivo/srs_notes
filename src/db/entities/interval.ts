export interface IInterval {
    id: string
    noteId: string
    openTimestamp: number // ms
    openDuration: number // ms
}

export const storeName = "intervals"

export interface IntervalDb {
    [storeName]: {
        key: string,
        value: IInterval
        indexes: {
            "by-noteId": string,
        }
    }
}