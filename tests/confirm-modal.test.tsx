import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmEstimateModal } from '../src/components/ConfirmEstimateModal';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmEstimateModal', () => {
  it('renders and calls onConfirm with entered value', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <ConfirmEstimateModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        suggestedEstimate="5"
        topicTitle="Test Topic"
      />
    );

    expect(screen.getByText(/Confirm Estimate/i)).toBeDefined();
    expect(screen.getByText('Test Topic')).toBeDefined();

    const input = screen.getByDisplayValue('5');
    fireEvent.change(input, { target: { value: '8' } });

    const submitButton = screen.getByRole('button', { name: /Save & Next/i });
    fireEvent.click(submitButton);

    expect(onConfirm).toHaveBeenCalledWith('8');
  });

  it('allows selecting common values', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmEstimateModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        suggestedEstimate="5"
        topicTitle="T"
      />
    );

    const valueButton = screen.getByRole('button', { name: '13' });
    fireEvent.click(valueButton);

    const input = screen.getByDisplayValue('13');
    expect(input).toBeDefined();
  });

  it('handles numeric suggested estimate safely', () => {
    render(
      <ConfirmEstimateModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        suggestedEstimate={5 as unknown as string}
        topicTitle="T"
      />
    );

    const submitButton = screen.getByRole('button', {
      name: /Save & Next/i,
    }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });
});
