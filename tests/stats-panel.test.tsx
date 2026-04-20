import { render, screen } from '@testing-library/react';
import { StatsPanel } from '../src/components/StatsPanel';
import { describe, it, expect } from 'vitest';

describe('StatsPanel', () => {
  const players = [
    { identityId: '1', name: 'Alice' },
    { identityId: '2', name: 'Bob' },
    { identityId: '3', name: 'Charlie' },
  ];

  it('renders average, median, and mode', () => {
    const votes = [
      { identityId: '1', value: '3' },
      { identityId: '2', value: '5' },
      { identityId: '3', value: '8' },
    ];

    render(<StatsPanel players={players} votes={votes} />);

    expect(screen.getByText('Average')).toBeDefined();
    expect(screen.getByText('5.33')).toBeDefined();
    expect(screen.getByText('Median')).toBeDefined();
    // Use getAllByText because '5' now appears in stats and distribution
    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    expect(screen.getByText('Mode')).toBeDefined();
    expect(screen.getByText('3, 5, 8')).toBeDefined();
  });

  it('renders vote distribution counts', () => {
    const votes = [
      { identityId: '1', value: '3' },
      { identityId: '2', value: '5' },
      { identityId: '3', value: '5' },
    ];

    render(<StatsPanel players={players} votes={votes} />);

    expect(screen.getByText('1 vote')).toBeDefined(); // for '3'
    expect(screen.getByText('2 votes')).toBeDefined(); // for '5'
  });

  it('shows "Needs Discussion" badge and outlier names when spread > 2', () => {
    const votes = [
      { identityId: '1', value: '1' },
      { identityId: '2', value: '5' },
      { identityId: '3', value: '8' },
    ];

    render(<StatsPanel players={players} votes={votes} />);

    expect(screen.getByText('Needs Discussion')).toBeDefined();
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('(1)')).toBeDefined();
    expect(screen.getByText('Charlie')).toBeDefined();
    expect(screen.getByText('(8)')).toBeDefined();
  });

  it('does not show "Needs Discussion" badge when spread <= 2', () => {
    const votes = [
      { identityId: '1', value: '3' },
      { identityId: '2', value: '5' },
      { identityId: '3', value: '5' },
    ];

    render(<StatsPanel players={players} votes={votes} />);

    expect(screen.queryByText('Needs Discussion')).toBeNull();
  });

  it('shows tooltips clarifying numeric-only calculations', () => {
    const votes = [
      { identityId: '1', value: '3' },
      { identityId: '2', value: '?' },
    ];

    render(<StatsPanel players={players} votes={votes} />);

    const averageLabel = screen.getByText('Average');
    expect(averageLabel.title).toContain('numeric votes only');
  });
});
