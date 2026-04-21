import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Neo-Brutalist Foundations', () => {
  const stylesPath = join(process.cwd(), 'src', 'styles.css');
  const stylesContent = readFileSync(stylesPath, 'utf8');

  it('should import Space Grotesk font', () => {
    expect(stylesContent).toContain('Space Grotesk');
  });

  it('should define Retro Yellow color', () => {
    expect(stylesContent).toContain('#f7df1e');
  });

  it('should define Retro Pink color', () => {
    expect(stylesContent).toContain('#FF00E5');
  });

  it('should define Retro Blue color', () => {
    expect(stylesContent).toContain('#93c5fd');
  });

  it('should define Retro Green color', () => {
    expect(stylesContent).toContain('#4ade80');
  });

  it('should implement .brutal-border class', () => {
    expect(stylesContent).toContain('.brutal-border');
    expect(stylesContent).toContain('var(--brutal-border-width) solid #000');
    expect(stylesContent).toContain('--brutal-border-width: 4px');
    expect(stylesContent).toContain('border-radius: var(--brutal-radius)');
    expect(stylesContent).toContain('--brutal-radius: 8px');
  });

  it('should implement .brutal-shadow class', () => {
    expect(stylesContent).toContain('.brutal-shadow');
    expect(stylesContent).toContain('box-shadow: 6px 6px 0px 0px #000');
  });

  it('should implement .bg-grid pattern', () => {
    expect(stylesContent).toContain('.bg-grid');
    expect(stylesContent).toContain('radial-gradient');
  });
});
