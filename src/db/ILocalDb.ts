import type { Coord } from "../utils/Coord";

export interface ILocalDb {
    createNote(gridId: string, coord: Coord, front: string, back: string): Promise<void>
}