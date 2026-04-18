import { render, screen, fireEvent } from '@testing-library/react';
import JuiceToggle from '../src/components/JuiceToggle';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

describe('JuiceToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should toggle sensory juice state on click', () => {
    render(<JuiceToggle />);
    const button = screen.getByRole('button');

    // Initial state (default true)
    expect(button.textContent).toContain('Juice On');

    // Toggle to off
    fireEvent.click(button);
    expect(button.textContent).toContain('Juice Off');
    expect(localStorage.getItem('sensory-juice')).toBe('false');

    // Toggle back to on
    fireEvent.click(button);
    expect(button.textContent).toContain('Juice On');
    expect(localStorage.getItem('sensory-juice')).toBe('true');
  });
});
