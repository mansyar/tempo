import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Router', () => {
  it('should have a router.tsx file in src directory', () => {
    expect(existsSync(join(process.cwd(), 'src', 'router.tsx'))).toBe(true);
  });

  it('should export getRouter function', () => {
    const routerContent = readFileSync(
      join(process.cwd(), 'src', 'router.tsx'),
      'utf8'
    );
    expect(routerContent).toContain('export function getRouter');
  });

  it('should return a valid router instance when getRouter is called', async () => {
    // Import the router module
    const routerModule = await import('../src/router');
    const getRouter = routerModule.getRouter;

    // Call getRouter
    const router = getRouter();

    // Verify it returns a valid object
    expect(router).toBeDefined();
    expect(router).toBeTruthy();
    expect(typeof router).toBe('object');
  });
});
