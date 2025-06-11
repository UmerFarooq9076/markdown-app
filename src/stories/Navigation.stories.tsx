import { Navigation } from '../components/Navigation/Navigation';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  tags: ["autodocs"]
};
export default meta;

type Story = StoryObj<typeof Navigation>;

export const Slides: Story = {
  args: {
    slides: [
      { content: 'Slide 1' },
      { content: 'Slide 2' },
      { content: 'Slide 3' },
    ],
    handleClick: (index: number) => alert(`Slide ${index + 1} clicked`),
  },
};
