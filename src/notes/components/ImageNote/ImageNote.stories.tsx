import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageNote } from './ImageNote';

const meta = {
  title: 'Notes/ImageNote',
  component: ImageNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: '',
    kind: 'image',
    name: "image name",
    data: new Blob([]),
    createdAt: 0,
    updatedAt: 0
  }
} satisfies Meta<typeof ImageNote>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    loaders: [
        async () => ({
            blob: await (await fetch("/vite.svg")).blob()
        })
    ],
    render: (args, { loaded: { blob } }) => <ImageNote {...args} data={blob} />
}