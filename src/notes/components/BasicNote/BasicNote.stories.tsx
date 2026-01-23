import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoreStateUtility } from '../../../utils/StoreState';
import { BasicNote as BasicNoteUtils } from '../../../db/entities/Note.utils';
import { BasicNote } from './BasicNote';
import type { IBasicNote } from '../../../db/entities/Note';

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

const apiState = new StoreStateUtility()
const doc = apiState.addDocument('doc', 'list')
const { note } = apiState.addNote(doc, BasicNoteUtils.random())
apiState.addInterval(note, { openDuration: 10000, openTimestamp: Date.now()})

export const Opened: Story = {
  args: {
    ...note as IBasicNote
  },
  parameters: {
    redux: apiState
  } ,
}