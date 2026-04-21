import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../src/components/Footer';

describe('Footer Rebranding', () => {
  it('renders footer with Tempo copyright', () => {
    render(<Footer />);

    // Check for "© 2026 Tempo" text
    expect(screen.queryByText(/© 2026 Tempo/)).toBeTruthy();

    // Check that "Pointy" is NO LONGER present
    expect(screen.queryByText(/Pointy/)).toBeNull();
  });
});
