/** @jest-environment jsdom */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HelloPage from '../../../../app/hello/page';

describe('HelloPage', () => {
  beforeEach(() => {
    // reset any fetch mock
    // @ts-ignore
    global.fetch = undefined;
  });

  it('submits name and displays greeting', async () => {
    const mockedText = 'こんにちは、花子さん';
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(mockedText),
      }),
    );

    render(<HelloPage />);
    const input = screen.getByPlaceholderText('名前を入力');
    const button = screen.getByRole('button', { name: /挨拶する|送信中/i });

    await userEvent.type(input, '花子');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/結果:/)).toBeInTheDocument();
      expect(screen.getByText(mockedText)).toBeInTheDocument();
    });

    // ensure fetch called with expected payload
    // @ts-ignore
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/hello',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
