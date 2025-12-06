import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary',
    uiVariant: 'primary',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button uiVariant="primary" size="sm">
        Small
      </Button>
      <Button uiVariant="primary" size="md">
        Medium
      </Button>
      <Button uiVariant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};
