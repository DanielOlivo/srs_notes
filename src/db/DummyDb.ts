import { v4 } from "uuid";
import type { Vector2 } from "../utils/Coord";
import { NotImplemented } from "../utils/NotImplemented";
import type { ILocalDb } from "./ILocalDb";
import type { useDeleteBasicNoteMutation } from "../notes/note.api";
import type { GridDto } from "../dtos/GridDto";



export class DummyDb implements ILocalDb {

    private grids: Map<string, GridDto>
    private noteIds: Map<string, Set<string>> // key - gridId

    constructor() {
        this.gridIds = new Set()
        this.noteIds = new Map()
    }

    async createGrid(name: string): Promise<string> {
        throw new NotImplemented()
    }

    async deleteGrid(gridId: string) {
        throw new NotImplemented()
    }

    async createNote(gridId: string, coord: Vector2, front: string, back: string){
        throw new NotImplemented()
    } 

    async updateBasicNote(noteId: string, front: string, back: string){
        throw new NotImplemented()
    }

    async deleteNote(noteId: string){
        throw new NotImplemented()
    }

    async getNote(noteId: string) {
        throw new NotImplemented()
    }

    async getNoteAtCoord(gridId: string, coord: Vector2) {
        throw new NotImplemented()
    }

    async getNotesAroundCoord(gridId: string, coord: Vector2, squareHalfSize: number) {
        throw new NotImplemented()
    }

    async swapNotes(noteId1: string, noteId2: string | null): Promise<void> {
        throw new NotImplemented()
    }


    // for editing

    addGrid(): string {
        const id = v4()
        this.gridIds.add(id)
        return id
    }

    addTextNote(gridId: string, coord: Vector2, text: string): string {
        throw new NotImplemented()
    }

    addImageNote(gridId: string, coord: Vector2, imageSrc: string): string {
        throw new NotImplemented()
    }

    addBasicNote(gridId: string, coord: Vector2, front: string, back: string): string {
        throw new NotImplemented()
    }

    setBasicNoteConfig(noteId: string, nextInterval: number, lastOpenTimestamp: number): string {
        throw new NotImplemented()
    }
}