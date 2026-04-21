import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SectionErrorBoundary from '../src/components/shared/SectionErrorBoundary';

const BuggyComponent = () => {
  throw new Error('Test Error');
};

describe('SectionErrorBoundary', () => {
  it('should render fallback UI when a child crashes', () => {
    // Suppress console.error for this test as React will log it
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <SectionErrorBoundary name="Test Section">
        <BuggyComponent />
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    expect(screen.getByText(/Test Section/i)).toBeDefined();

    spy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <SectionErrorBoundary name="Test Section">
        <div>Normal Content</div>
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/Normal Content/i)).toBeDefined();
  });
});
