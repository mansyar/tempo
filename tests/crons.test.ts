import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Cron Jobs', () => {
  it('should have a crons.ts file in convex directory', () => {
    expect(existsSync(join(process.cwd(), 'convex', 'crons.ts'))).toBe(true);
  });

  it('should export default crons', () => {
    const cronsContent = readFileSync(
      join(process.cwd(), 'convex', 'crons.ts'),
      'utf8'
    );
    expect(cronsContent).toContain('export default crons');
  });

  it('should define mark-offline-players interval', () => {
    const cronsContent = readFileSync(
      join(process.cwd(), 'convex', 'crons.ts'),
      'utf8'
    );
    expect(cronsContent).toContain("'mark-offline-players'");
    expect(cronsContent).toContain('api.players.markOffline');
  });

  it('should define cleanup-stale-rooms interval', () => {
    const cronsContent = readFileSync(
      join(process.cwd(), 'convex', 'crons.ts'),
      'utf8'
    );
    expect(cronsContent).toContain("'cleanup-stale-rooms'");
    expect(cronsContent).toContain('internal.cleanup.staleRooms');
  });

  it('should execute cron jobs initialization without errors', async () => {
    // Import the crons module to ensure it executes without errors
    const cronsModule = await import('../convex/crons');
    expect(cronsModule.default).toBeDefined();
  });
});
