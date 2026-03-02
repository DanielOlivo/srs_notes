import type { Meta, StoryObj } from '@storybook/react-vite';
import { Document } from './Document';

const meta = {
  title: 'Db/Document',
  component: Document,
  tags: ['autodocs'],
} satisfies Meta<typeof Document>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        id: "1"
    },
    parameters: {
        idb: {
            documents: [
                {
                    id: "1",
                    name: "test document name",
                    createdAt: 0,
                    type: 'list'
                }
            ]
        } satisfies IdbParams
    },
}