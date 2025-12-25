import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/docs', '/blog'];

for (const path of routes) {
  test(`a11y smoke: ${path}`, async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });

    const results = await new AxeBuilder({ page })
      // نركز على الانتهاكات الحرجة فقط كـ smoke
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const seriousOrWorse = results.violations.filter(v =>
      ['serious', 'critical'].includes(v.impact || '')
    );

    // اطبع ملخص مفيد لو فشل
    if (seriousOrWorse.length) {
      console.log(JSON.stringify(seriousOrWorse.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
      })), null, 2));
    }

    expect(seriousOrWorse, 'Found serious/critical a11y violations').toHaveLength(0);
  });
}
