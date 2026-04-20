import { describe, it, expect } from 'vitest';
import {
  generateMarkdown,
  generateSummary,
  generateCSV,
} from '../src/utils/exporter';

describe('Export Utilities', () => {
  const mockTopics = [
    { title: 'Feature A', finalEstimate: '5' },
    { title: 'Feature B', finalEstimate: '13' },
    { title: 'Feature C', finalEstimate: '?' },
  ];

  it('generates a Markdown table correctly', () => {
    const md = generateMarkdown('Test Room', mockTopics);
    expect(md).toContain('# Session Export: Test Room');
    expect(md).toContain('| Topic | Final Estimate |');
    expect(md).toContain('| Feature A | 5 |');
    expect(md).toContain('| Feature B | 13 |');
    expect(md).toContain('| Feature C | ? |');
  });

  it('generates a Markdown table with null estimate', () => {
    const topicsWithNull = [{ title: 'Feature A', finalEstimate: null }];
    const md = generateMarkdown('Test Room', topicsWithNull);
    expect(md).toContain('| Feature A | - |');
  });

  it('generates a Markdown table with undefined estimate', () => {
    const topicsWithUndefined = [{ title: 'Feature A' }];
    const md = generateMarkdown('Test Room', topicsWithUndefined);
    expect(md).toContain('| Feature A | - |');
  });

  it('generates a Summary List correctly', () => {
    const summary = generateSummary('Test Room', mockTopics);
    expect(summary).toContain('Session Summary: Test Room');
    expect(summary).toContain('- Feature A: 5');
    expect(summary).toContain('- Feature B: 13');
    expect(summary).toContain('- Feature C: ?');
  });

  it('generates a Summary List with null estimate', () => {
    const topicsWithNull = [{ title: 'Feature A', finalEstimate: null }];
    const summary = generateSummary('Test Room', topicsWithNull);
    expect(summary).toContain('- Feature A: -');
  });

  it('generates a Summary List with undefined estimate', () => {
    const topicsWithUndefined = [{ title: 'Feature A' }];
    const summary = generateSummary('Test Room', topicsWithUndefined);
    expect(summary).toContain('- Feature A: -');
  });

  it('generates a CSV string correctly', () => {
    const csv = generateCSV(mockTopics);
    expect(csv).toBe(
      'Topic,Final Estimate\n"Feature A","5"\n"Feature B","13"\n"Feature C","?"'
    );
  });

  it('generates a CSV string with null estimate', () => {
    const topicsWithNull = [{ title: 'Feature A', finalEstimate: null }];
    const csv = generateCSV(topicsWithNull);
    expect(csv).toContain('"Feature A","-"');
  });

  it('generates a CSV string with undefined estimate', () => {
    const topicsWithUndefined = [{ title: 'Feature A' }];
    const csv = generateCSV(topicsWithUndefined);
    expect(csv).toContain('"Feature A","-"');
  });

  it('escapes double quotes in CSV', () => {
    const topicsWithQuotes = [{ title: 'Feature "A"', finalEstimate: '5' }];
    const csv = generateCSV(topicsWithQuotes);
    expect(csv).toContain('"Feature ""A""","5"');
  });
});
