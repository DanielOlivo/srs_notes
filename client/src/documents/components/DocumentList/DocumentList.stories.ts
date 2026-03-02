import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocumentList } from './DocumentList';
import { StoreStateUtility } from '../../../utils/StoreState';
import { faker } from '@faker-js/faker';

const meta = {
  title: 'Documents/List',
  component: DocumentList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentList>

export default meta
type Story = StoryObj<typeof meta>

const apiData = new StoreStateUtility()
for(let i = 0; i < 30; i++){
    apiData.addDocument(faker.lorem.word(), 'list')
}

export const Primary: Story = {
    parameters: {
        redux: apiData
    }
}