import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridCreatePanel } from './GridCreatePanel';

const meta = {
  title: 'Grid/GridCreatePanel',
  component: GridCreatePanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GridCreatePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {}