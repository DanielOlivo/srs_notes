import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid2, type Grid2Props } from './Grid2';
import type { Vector2 } from '../../../utils/Coord';

const meta = {
  title: 'Test/Grid2',
  component: Grid2,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Grid2>;

export default meta;
type Story = StoryObj<typeof meta>;

const args: Grid2Props = {
    mode: 'normal',
    cellSize: {
        width: 200,
        height: 100
    },
    gap: 5,
    swap: (coord1: Vector2, coord2: Vector2) => {
        console.log(`wrap call: {${coord1.toString()}, ${coord2.toString()}`)
    },
    selectCoord: (coord: Vector2) => {
        console.log(`selectCoord: ${coord.toString()}`)
    }
}

const styles = {
    width: "100vh",
    height: "90vh",
}

export const Normal: Story = {
    args,
    parameters: {
        styles
    }
}

export const Edit: Story = {
    args: {...args, mode: 'edit'},
    parameters: {
        styles
    }
}