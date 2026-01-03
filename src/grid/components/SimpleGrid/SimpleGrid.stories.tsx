import type { Meta, StoryObj } from '@storybook/react-vite';
import { SimpleGrid } from './SimpleGrid';
import { GridView } from './components/GridView';
import { GridControl } from './components/GridControl';

const meta = {
  title: 'Grid/Simple',
  component: SimpleGrid,
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {}