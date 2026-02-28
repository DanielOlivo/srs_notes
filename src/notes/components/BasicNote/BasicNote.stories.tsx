import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoreStateUtility } from '../../../utils/StoreState';
import { BasicNote as BasicNoteUtils } from '../../../db/entities/Note.utils';
import { BasicNote } from './BasicNote';
import { BasicNote as BasicNoteEntity } from '../../../db/entities/Note.utils';
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
  }
} satisfies Meta<typeof BasicNote>

export default meta
type Story = StoryObj<typeof meta>

export const Opened: Story = {
  render: (_args, data ) => {
    return <BasicNote {...(data.loaded as IBasicNote)} />
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