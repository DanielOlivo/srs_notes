import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicNote } from './BasicNote';
import { BasicNote as BasicNoteEntity, Interval } from '@db/entities/Note.utils';
import { getDb } from '@db/LocalDb';
import type { BasicNoteData, IBasicNote } from '@db/entities/Note';
import type { INoteId } from '@notes/note.defs';
import type { IDocId } from 'src/documents/document.defs';

const meta = {
  title: 'Notes/BasicNote',
  component: BasicNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: '',
    kind: 'basic',
    front: "front",
    back: "back",
    createdAt: 0,
    updatedAt: 0
  },
  render: (_args, data) => <BasicNote {...(data.loaded as IBasicNote)} />
} satisfies Meta<typeof BasicNote>

export default meta
type Story = StoryObj<typeof meta>

export const Opened: Story = {
  parameters: {
    redux: {
      incrTime: true
    }
  },
  loaders: [
    async () => {
      const db = await getDb()
      const docId = "basicNoteDocIdOpened"
      const note = BasicNoteEntity.random()
      const data: BasicNoteData = {
        kind: 'basic',
        front: note.front,
        back: note.back
      }
      note.id = "basicNote-primary"
      const existingDoc = await db.getDocumentById(docId)
      if(!existingDoc){
        await db.createDocument('doc', 'list', docId as IDocId)
      }
      await db.purgeNote(note.id as INoteId)
      await db.createListNote(docId, data, undefined, note.id as INoteId)
      return note.asPlain()
    }
  ]
}

export const Closed: Story = {
  parameters: {
    redux: { incrTime: true }
  },
  loaders: [
    async () => {
      const db = await getDb()
      const docId = "basicNoteDocIdClosed"
      const note = BasicNoteEntity.random()
      const data: BasicNoteData = {
        kind: 'basic',
        front: note.front,
        back: note.back
      }
      note.id = "basicNote-closed"
      const existingDoc = await db.getDocumentById(docId)
      if(!existingDoc){
        await db.createDocument('doc', 'list', docId as IDocId)
      }
      await db.purgeNote(note.id as INoteId)
      await db.createListNote(docId, data, undefined, note.id as INoteId)

      const interval = await Interval.getByNoteId(note.id)
      if(interval){
        interval.openTimestamp -= 80000
        await interval.update()
      }

      return note.asPlain()
    }
  ]
}