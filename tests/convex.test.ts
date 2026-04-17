import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Convex Setup', () => {
  it('should have a convex directory', () => {
    expect(existsSync(join(process.cwd(), 'convex'))).toBe(true);
  });

  it('should have a schema.ts file in convex directory', () => {
    expect(existsSync(join(process.cwd(), 'convex', 'schema.ts'))).toBe(true);
  });

  it('should define rooms and players tables in schema.ts', () => {
    const schemaContent = readFileSync(join(process.cwd(), 'convex', 'schema.ts'), 'utf8');
    expect(schemaContent).toContain('rooms: defineTable');
    expect(schemaContent).toContain('players: defineTable');
  });
});
