import type { Coord } from "../utils/Coord"

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
    coord: Coord
}

export interface RemoveNoteFromGridRequestDto {
    atlasId: string
    noteId: string
}

export interface ReplaceNoteRequestDto {
    atlasId: string
    noteId: string
    newCoord: Coord
}