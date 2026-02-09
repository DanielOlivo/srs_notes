export type IVector2 = {
    x: number;
    y: number
}

export class Vector2 implements IVector2 {

    x: number;
    y: number

    // public get x() { return this._x; }
    // public get y() { return this._y}

    private static  limit = Math.pow(2, 16)

    constructor(x: number, y: number){
        // this._x = x
        // this._y = y
        this.x = x
        this.y = y

        if(Math.abs(x) >= Vector2.limit || Math.abs(y) >= Vector2.limit){
            throw new Error("Coordinates out of range")
        }
    }

    asPlain = (): IVector2 => ({
        x: this.x,
        y: this.y
    })

    hash(): number {
        return (Vector2.limit + this.x) << 16 | (Vector2.limit + this.y); 
    }

    static toKey(coord: IVector2): string {
        return `${coord.x},${coord.y}`
    }

    static get up() {
        return new Vector2(0, -1)
    }

    static get down() {
        return new Vector2(0, 1)
    }

    static get left() {
        return new Vector2(-1, 0)
    }

    static get right() {
        return new Vector2(1, 0)
    }


    static get zero() {
        return new Vector2(0, 0)
    }

    static from(coord: {x: number, y: number}): Vector2 {
        return new Vector2(coord.x, coord.y)
    }

    static fromClient<T extends HTMLElement>(e: React.MouseEvent<T>): Vector2 {
        return new Vector2(e.clientX, e.clientY)
    }

    static fromHash(hash: number): Vector2 {
        const limit = Vector2.limit;
        return new Vector2(
            (hash >> 16) - limit, // x
            (hash & 0xffff) - limit // y
        )
    }

    equals(other: Vector2){
        return this.x === other.x && this.y === other.y
    }

    static add(coord1: IVector2, coord2: IVector2): IVector2 {
        return {
            x: coord1.x + coord2.x,
            y: coord1.y + coord2.y
        }
    }

    static sub(vec1: IVector2, vec2: IVector2): IVector2 {
        return {
            x: vec1.x - vec2.x,
            y: vec1.y - vec2.y
        }
    }

    sum(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y)
    }

    mul(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar)
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    divInt(coord: Vector2): Vector2 {
        return new Vector2(
            Math.floor(this.x / coord.x),
            Math.floor(this.y / coord.y)
        )
    }

    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}