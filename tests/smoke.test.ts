import { describe, it, expect } from 'vitest';

describe('NebulaWind smoke', () => {
  it('basic math sanity', () => {
    expect(1 + 1).toBe(2);
  });

  it('env typings file exists (project hygiene)', async () => {
    // This ensures we keep Astro/TS typing scaffolding in place.
    const fs = await import('node:fs/promises');
    const p = 'src/env.d.ts';
    const content = await fs.readFile(p, 'utf8');
    expect(content).toContain('astro/client');
  });
});
