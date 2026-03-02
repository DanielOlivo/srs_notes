import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextNote } from './TextNote';

const meta = {
  title: 'Notes/TextNote',
  component: TextNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: '',
    kind: 'text',
    text: "some text",
    createdAt: 0,
    updatedAt: 0
  }
} satisfies Meta<typeof TextNote>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}