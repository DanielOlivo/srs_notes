import { v4 } from "uuid";
import type { BasicNoteData, IBaseNote, IBasicNote, ITextNote, NoteType, TextNoteData } from "./Note";
import { faker } from "@faker-js/faker";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class BaseNote implements IBaseNote {
    @IsUUID()
    id: string

    @IsNumber()
    createdAt: number

    @IsNumber()
    updatedAt: number

    constructor(id: string, createdAt: number, updatedAt: number){
        this.id = id
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class BasicNote extends BaseNote implements IBasicNote {

    @IsString()
    @IsNotEmpty()
    front: string

    @IsString()
    @IsNotEmpty()
    back: string

    kind: BasicNoteData['kind']

    constructor(id: string, createdAt: number, updatedAt: number, front: string, back: string){
        super(id, createdAt, updatedAt)
        this.front = front
        this.back = back
        this.kind = "basic"
    }

    static random = (): IBasicNote => new BasicNote(
        v4(),
        Date.now(),
        Date.now(),
        faker.location.country(),
        faker.location.city(),
    )

}

export class TextNote extends BaseNote implements ITextNote {

    text: string
    kind: TextNoteData['kind']

    constructor(id: string, createdAt: number, updatedAt: number, text: string) {
        super(id, createdAt, updatedAt)
        this.text = text
        this.kind = 'text'
    } 

    static random = (): ITextNote => new TextNote(
        v4(),
        Date.now(),
        Date.now(),
        faker.lorem.sentence(),
    )
}