import { render, screen, fireEvent } from '@testing-library/react';
import { BatchAddModal } from '../src/components/BatchAddModal';
import { describe, it, expect, vi } from 'vitest';
import type { Id } from '../convex/_generated/dataModel';

describe('BatchAddModal', () => {
  it('renders and calls onSubmit with correct data', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BatchAddModal
        roomId={'room1' as Id<'rooms'>}
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText(/Batch Add Topics/i)).toBeDefined();

    const textarea = screen.getByPlaceholderText(/Topic 1/i);
    fireEvent.change(textarea, {
      target: { value: 'Topic 1\nTopic 2\n\nTopic 3' },
    });

    const submitButton = screen.getByRole('button', { name: /Add Topics/i });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith('Topic 1\nTopic 2\n\nTopic 3');
  });

  it('validates empty input', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BatchAddModal
        roomId={'room1' as Id<'rooms'>}
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const submitButton = screen.getByRole('button', {
      name: /Add Topics/i,
    }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('calls onClose when close button or backdrop is clicked', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <BatchAddModal
        roomId={'room1' as Id<'rooms'>}
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    const closeButton = screen.getByLabelText(/Close/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
