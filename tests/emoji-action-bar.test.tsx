import { render, screen, fireEvent } from '@testing-library/react';
import { EmojiActionBar } from '../src/components/EmojiActionBar';
import { describe, it, expect, vi } from 'vitest';

describe('EmojiActionBar', () => {
  it('should render all predefined emojis', () => {
    const onSelect = vi.fn();
    render(<EmojiActionBar onSelect={onSelect} />);

    expect(screen.getByText('❤️')).toBeDefined();
    expect(screen.getByText('👏')).toBeDefined();
    expect(screen.getByText('🔥')).toBeDefined();
    expect(screen.getByText('😂')).toBeDefined();
    expect(screen.getByText('🎉')).toBeDefined();
  });

  it('should call onSelect with the correct emoji when clicked', () => {
    const onSelect = vi.fn();
    render(<EmojiActionBar onSelect={onSelect} />);

    fireEvent.click(screen.getByText('❤️'));
    expect(onSelect).toHaveBeenCalledWith('❤️');
  });

  it('should be keyboard navigable', () => {
    const onSelect = vi.fn();
    render(<EmojiActionBar onSelect={onSelect} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(5);

    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
  });
});
