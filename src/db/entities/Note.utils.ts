import { v4 } from "uuid";
import type { IBasicNote, ITextNote } from "./Note";
import { faker } from "@faker-js/faker";

export class BasicNote {

    static random = (): IBasicNote => ({
        id: v4(),
        kind: 'basic',
        front: `capital of ${faker.location.country()}`,
        back: faker.location.city(),
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

}

export class TextNote {
    static random = (): ITextNote => ({
        id: v4(),
        kind: 'text',
        text: faker.lorem.sentence(),
        createdAt: Date.now(),
        updatedAt: Date.now()
    })
}