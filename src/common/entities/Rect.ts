export type Rect = {
    left: number
    top: number
    width: number
    height: number
}

export class RectImp {
    static default = () => ({ left: 0, top: 0, width: 0, height: 0 })
}