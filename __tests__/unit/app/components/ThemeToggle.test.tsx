/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../../../../app/components/ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders a toggle button', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    expect(btn).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(btn);
    const theme = document.documentElement.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(theme);
  });
});
