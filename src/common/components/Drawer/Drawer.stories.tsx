import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { faker } from '@faker-js/faker';

const meta = {
  title: 'Common/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
    args: { 
      src: faker.image.url() ,
      rects: [
        {left: 0.1, top: 0.1, width: 0.5, height: 0.5}
      ],
      onChange: (rects) => console.log(`rects update`, rects)
    },
    decorators: [
      (Story) => (
        <div className='size-72'>
          <Story />
        </div>
      )
    ]
}