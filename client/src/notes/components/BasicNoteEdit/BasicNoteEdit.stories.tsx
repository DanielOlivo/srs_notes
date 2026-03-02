import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicNoteEdit } from './BasicNoteEdit';
import { StoreStateUtility } from '../../../utils/StoreState';
import { BasicNote } from '../../../db/entities/Note.utils';
import type { StoreState } from '../../../app/store';


const meta = {
  title: 'Notes/BasicNoteEdit',
  component: BasicNoteEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BasicNoteEdit>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {}

const data = new StoreStateUtility()
const doc = data.addDocument('doc', 'list')
const { note }= data.addNote(doc, BasicNote.random())

export const Update: Story = {
    args: {
        id: note.id,
    },
    parameters: {
        redux: data as StoreState
    }

}