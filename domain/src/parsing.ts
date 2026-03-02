import { parse } from "papaparse"
import { v4 } from "uuid"

type IItem = {
    id: string
    amount: number
    label: string
}

class Item implements IItem {
    id: string
    amount: number
    label: string

    constructor(id: string, amount: number, label: string) {
        this.id = id
        this.amount = amount
        this.label = label
    }

    static random = () => new Item(
        v4(),
        Math.floor(Math.random() * 100),
        `label-${Math.random() * 100}`
    )

    toCsvRow = () => `${this.id},${this.amount},"${this.label}"` 

    static fromCsv = (csv: string): Item[] => {
        const data = parse(csv)
        const records = data.data as string[][]
        const items = records.map(row => {
            const [id, amount, label] = row
            return new Item(id, Number(amount), label)
        })
        return items
    }
}


export const testItems = () => {
    const items = Array.from({length: 100}, Item.random)
    const csvString = items.map(item => item.toCsvRow()).join('\n')
    console.log(csvString)
    const restored = Item.fromCsv(csvString)
    console.log(restored)
}