import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import type { StoreState } from '../../../app/store';

const meta = {
  title: 'Grid/Grid',
  component: Grid,
  // parameters: {
  //   // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
  //   layout: 'centered',
  // },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const args = {
    cellSize: {
      width: 200,
      height: 100
    },
    gap: 5
}

const styles = {
  width: "100%",
  height: "80vh",
  overflow: "hidden"
} satisfies React.CSSProperties

export const Normal: Story = {
  args,
  parameters: {
    styles,
    redux: {
      slices: {},
      gridApi: {
        getNoteAtCoord: Array.from({length: 10 * 10}, (_, i) => ({
          req: {
            gridId: "1",
            coord: {
              x: (i % 10) - 5,
              y: Math.floor(i / 10) - 5
            }
          },
          res: {
            id: i.toString(),
            kind: 'basic',
            front: `front ${i}`,
            back: `back ${i}`,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        }))
      }
    } satisfies StoreState
  }
}

export const Edit: Story = {
  args,
  parameters: {
    styles,
    redux: {
      slices: {
        gridReducer: {
          mode: { kind: 'edit', selected: null, isOver: null, onMoving: null } 
        }
      }
    } satisfies StoreState
  }
}

export const Rearrangement: Story = {
  args,
  parameters: {
    styles
  }
}

export const Review: Story = {
  args,
  parameters: {
    styles
  }
}