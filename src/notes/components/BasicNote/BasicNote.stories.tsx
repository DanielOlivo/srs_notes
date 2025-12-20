import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicNote } from './BasicNote';
import { Provider } from 'react-redux';
import { getStore } from '../../../app/store';

const meta = {
  title: 'Notes/BasicNote',
  component: BasicNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    note: {
        id: '',
        kind: 'basic',
        front: "front",
        back: "back",
        createdAt: 0,
        updatedAt: 0
    },
    gridId: '',
  }
} satisfies Meta<typeof BasicNote>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
    parameters: {} ,
    decorators: [
      (Story) => (
        <Provider store={getStore()}>
          <Story />
        </Provider>
      )
    ]
}