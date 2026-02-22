import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClozeNote } from './ClozeNote';
import { NoteId, type INoteId } from '../../note.defs';
import { v4 } from 'uuid';
import { CacheData } from '../../../common/utils/cacheLoader';

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

export const Primary: Story = {
    args: {
        noteId: "1" as INoteId,
        text: "hey {{dude}} what's {{up}}?"
    },
    parameters: {
        redux: {
            cache: CacheData.create(cache => {
                const interval = cache.createInterval("1" as INoteId, Date.now(), 1000 * 30)            
            })
        }
    }
}