import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageOcclusionNote } from './ImageOcclusionNote';

const meta = {
  title: 'Notes/ImageOcclusionNote',
  component: ImageOcclusionNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageOcclusionNote>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}