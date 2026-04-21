import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Favicon & Assets', () => {
  it('should have a favicon.svg file', () => {
    const faviconPath = join(process.cwd(), 'public', 'favicon.svg');
    expect(existsSync(faviconPath)).toBe(true);
  });
});
