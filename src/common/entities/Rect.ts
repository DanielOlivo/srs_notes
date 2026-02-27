export type IRect = {
    left: number
    top: number
    width: number
    height: number
}

export class Rect {

    static default = () => ({ left: 0, top: 0, width: 0, height: 0 })

    static random = () => {
        const getCoord = () => Math.floor(Math.random() * 70)
        return {
            left: getCoord(),
            top: getCoord(),
            width: 30,
            height: 30
        }
    }
}