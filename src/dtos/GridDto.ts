import type { Vector2 } from "../utils/Coord"

export interface CreateAtlasRequestDto {
    name: string
}

export interface GridDto {
    id: string
    name: string
    createdAt: number
    updatedAt: number
}

export interface AddNoteToGridRequestDto {
    atlasId: string
    noteId: string
    coord: Vector2
}

export interface RemoveNoteFromGridRequestDto {
    atlasId: string
    noteId: string
}

export interface ReplaceNoteRequestDto {
    atlasId: string
    noteId: string
    newCoord: Vector2
}