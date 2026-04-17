import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Project Initialization', () => {
  it('should have a package.json file', () => {
    expect(existsSync(join(process.cwd(), 'package.json'))).toBe(true);
  });

  it('should have TanStack Start dependencies', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('@tanstack/react-start');
  });

  it('should have Convex dependencies', () => {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
    expect(packageJson.dependencies).toHaveProperty('convex');
  });

  it('should have the expected plugins in vite.config.ts', () => {
    const viteConfigContent = readFileSync(join(process.cwd(), 'vite.config.ts'), 'utf8');
    expect(viteConfigContent).toContain('tailwindcss()');
    expect(viteConfigContent).toContain('tanstackStart()');
    expect(viteConfigContent).toContain('viteReact()');
  });
});
