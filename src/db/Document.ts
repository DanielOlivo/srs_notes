import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import type { IDocument } from "./entities/document";
import { v4 } from "uuid";

export class Document implements IDocument {

    @IsUUID()
    id: string

    @IsString()
    @IsNotEmpty()
    name: string

    type: IDocument['type']

    createdAt: number

    constructor(name: string, type: IDocument['type']){
        this.id = v4()
        this.name = name
        this.type = type
        this.createdAt = Date.now() 
    }

} 