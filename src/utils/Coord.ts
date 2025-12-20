export type Coord = {
    x: number;
    y: number
}

export class CoordHash {

    static limit = Math.pow(2, 16);

    static toHash({x, y}: Coord): number {
        if(Math.abs(x) >= CoordHash.limit || Math.abs(y) >= CoordHash.limit){
            throw new Error("Coordinates out of range")
        }
        return (CoordHash.limit + x) << 16 | (CoordHash.limit + y); 
    }

    static toCoord(hash: number): Coord {
        const limit = CoordHash.limit;
        return {
            x: (hash >> 16) - limit,
            y: (hash & 0xffff) - limit
        }
    }
}