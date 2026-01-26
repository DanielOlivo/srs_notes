import type { Meta, StoryObj } from '@storybook/react-vite';
import { List } from './List';
import type { Document } from '../../db/entities/document';
import type { IBasicNote, ITextNote } from '../../db/entities/Note';
import type { Position } from '../../db/entities/position';
import type { StoreState } from '../../app/store';
import { StoreStateUtility } from '../../utils/StoreState';
import { BasicNote, TextNote } from '../../db/entities/Note.utils';

const meta = {
  title: 'List/List',
  component: List,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

const document: Document = {
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

const basicNotePosition: Position = {
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


const textNotePosition: Position = {
    id: 1,
    noteId: textNote.id,
    documentId: document.id,
    coord: {x: 0, y: 0}
}

export const Primary: Story = {
    args: {
        documentId: document.id
    },
    parameters: {
        redux: {
            noteApi: {
                documents: [document],
                notes: [basicNote, textNote],
                positions: [basicNotePosition, textNotePosition],
                intervals: []
            }
        } satisfies StoreState
    }
}

const apiData = new StoreStateUtility()
const doc = apiData.addDocument('some document', 'list')
const notes = Array.from({length: 40}, () => BasicNote.random())
for(let i = 0; i < 40; i++){
    apiData.addNote(doc, notes[i])
    apiData.addInterval(notes[i], { openDuration: 900000, openTimestamp: Date.now() })
    apiData.addNote(doc, TextNote.random())
}

export const Many: Story = {
    args: {
        documentId: doc.id,
        height: 400
    },
    parameters: {
        styles: {
            width: "500px",
        },
        redux: {
            ...apiData
        } satisfies StoreState
    }
}