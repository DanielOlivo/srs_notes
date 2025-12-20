import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, type CellProps } from './Cell';
import { gridApi } from '../../grid.api';
import type { StoreState } from '../../../app/store';
import type { TextNoteDto } from '../../../notes/notes.dto';
import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

const meta = {
  title: 'Grid/Cell',
  component: Cell,
  // parameters: {
  //   // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
  //   layout: 'centered',
  // },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

const gridId = "1"
const coord = { x: 0, y: 0}
const gap = 5

const args = { gridId, coord, gap, cellSize: { width: 200, height: 100 } } satisfies CellProps
const gridApiNoContent = {
    getNoteAtCoord: [{ req: args, res: null}]
}
const textNoteDto: TextNoteDto = {
    kind: 'text',
    text: faker.lorem.word(),
    id: v4(),
    createdAt: Date.now(),
    updatedAt: Date.now()
}
const gridApiTextContent = {
    getNoteAtCoord: [{ req: args, res: textNoteDto}]
}

export const NormalNoContent: Story = {
    args,
    parameters: {
        redux: {
            slices: {
                gridReducer: { mode: { kind: 'normal' } }
            },
            gridApi: gridApiNoContent
        } satisfies StoreState 
    }
}

export const EditNoContent: Story = {
    args,
    parameters: {
        redux: {
            slices: {
                gridReducer: { mode: { kind: 'edit', selected: null } }
            },
            gridApi: gridApiNoContent
        } satisfies StoreState 
    }
}

export const RearrangementNoContent: Story = {
    args,
    parameters: {
        redux: {
            slices: {
                gridReducer: { mode: { kind: 'edit', selected: null } }
            },
            gridApi: gridApiNoContent
        } satisfies StoreState 
    }
}

export const ReviewNoContent: Story = {
    args,
    parameters: {
        redux: {
            slices: {
                gridReducer: { mode: { kind: "review"}}
            },
            gridApi: gridApiNoContent
        } satisfies StoreState
    }
}

export const NomralTextContent: Story = {
    args,
    parameters: {
        redux: {
            slices: {
                gridReducer: { mode: { kind: 'normal'}}
            },
            gridApi: gridApiTextContent
        } satisfies StoreState
    }
}