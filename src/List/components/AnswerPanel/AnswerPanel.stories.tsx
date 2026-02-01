import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnswerPanel } from './AnswerPanel';
import { BasicNote } from '../../../db/entities/Note.utils';
import { getStoreWithState } from '../../../app/store';

const meta = {
  title: 'List/AnswerPanel',
  component: AnswerPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnswerPanel>

export default meta
type Story = StoryObj<typeof meta>

const note = BasicNote.random()
// const store = getStoreWithState()

// export const Primary: Story = {

// }