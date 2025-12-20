import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridList } from './GridList';
import type { StoreState } from '../../../app/store';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { GridItemDto } from '../../grid.dto';

const meta = {
  title: 'Grid/GridList',
  component: GridList,
  tags: ['autodocs'],
} satisfies Meta<typeof GridList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    parameters: {
        redux:{
            gridApi: {
                getGridList: GridItemDto.random(10)
            }
        } satisfies StoreState
    }
}