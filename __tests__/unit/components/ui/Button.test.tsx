/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../../../components/ui/Button';

describe('components/ui/Button', () => {
  it('renders and applies variant and size classes', () => {
    render(
      <Button uiVariant="primary" size="lg">
        Click
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /click/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('btn-primary');
    expect(btn).toHaveClass('btn-lg');
  });

  it('accepts additional className and props', () => {
    render(
      <Button data-testid="my-btn" className="custom-class">
        Hello
      </Button>,
    );
    const btn = screen.getByTestId('my-btn');
    expect(btn).toHaveClass('custom-class');
  });
});
