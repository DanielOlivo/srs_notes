import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import type { Coord } from "../utils/Coord"
import { v4 } from "uuid";
import { faker } from "@faker-js/faker";

export class GridItemDto {

    @IsString() 
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    createdAt: number

    constructor(id: string, name: string, createdAt: number){
        this.id = id
        this.name = name
        this.createdAt = createdAt
    }

    static random(amount?: number): GridItemDto[] {
        return Array.from({length: amount ?? 1}, () => 
            new GridItemDto(
                v4(),
                faker.lorem.word(),
                Date.now()
            )
        )
    }
}

export interface NoteAtCoordRequestDto {
    gridId: string
    coord: Coord
}

export interface NoteConfigRequest {
    noteId: string
    gridId: string
}

export interface GridNoteConfigDto {
    id: string
    noteId: string
    gridId: string
    currentOpenInterval: number
    lastOpenTimestamp: number
}