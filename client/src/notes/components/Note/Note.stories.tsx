import type { Meta, StoryObj } from '@storybook/react-vite';
import { Note } from './Note';
import type { IBasicNote, ITextNote } from '../../../db/entities/Note';
import type { IDocument } from '../../../db/entities/document';
import type { IPosition } from '../../../db/entities/position';
import type { StoreState } from '../../../app/store';

const meta = {
  title: 'Notes/Note',
  component: Note,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

const document: IDocument = {
    id: "1",
    type: 'list',
    name: "some document",
    createdAt: 0,
}

const basicNote: IBasicNote = {
    id: '1',
    kind: 'basic',
    createdAt: 0,
    updatedAt: 0,
    front: "some front",
    back: "some back"
}

const basicNotePosition: IPosition = {
    id: 2,
    noteId: basicNote.id,
    documentId: document.id,
    coord: {x: 0, y: 0}
}

const textNote: ITextNote = {
    id: '2',
    kind: 'text',
    text: "some text",
    createdAt: 0,
    updatedAt: 0
}


const textNotePosition: IPosition = {
    id: 1,
    noteId: textNote.id,
    documentId: document.id,
    coord: {x: 0, y: 0}
}

export const HasBasicNote: Story = {
    args: {
        id: basicNote.id
    },
    parameters: {
        redux: {
            noteApi: {
                notes: [basicNote],
                positions: [basicNotePosition],
                documents: [document]
            }
        } satisfies StoreState
    }
}

export const HasTextNote: Story = {
    args: {
        id: textNote.id
    },
    parameters: {
        redux: {
            noteApi: {
                documents: [document],
                notes: [textNote],
                positions: [textNotePosition]
            }
        } satisfies StoreState
    }
}
