import type { Meta, StoryObj } from '@storybook/react-vite';
import { IntroPage } from './IntroPage';
import { GridItemDto } from '../../grid.dto';
import type { StoreState } from '../../../app/store';

const meta = {
  title: 'Grid/IntroPage',
  component: IntroPage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IntroPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    parameters: {
        redux: {
            gridApi: {
                getGridList: GridItemDto.random(10)
            }
        } satisfies StoreState
    }
}