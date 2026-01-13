import type { Vector2 } from "../utils/Coord";

export interface ILocalDb {
    createNote(gridId: string, coord: Vector2, front: string, back: string): Promise<void>
}