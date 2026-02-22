import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClozeNote } from './ClozeNote';
import { NoteId } from '../../note.defs';
import { v4 } from 'uuid';

const meta = {
  title: 'Notes/Cloze',
  component: ClozeNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    noteId: NoteId.create(v4()),
    text: "hey {{dude}} what's {{up}}?"
  }
} satisfies Meta<typeof ClozeNote>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}