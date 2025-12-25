import { test, expect } from '@playwright/test';

const routes = ['/', '/docs', '/blog', '/rss.xml'];

for (const path of routes) {
  test(`route loads: ${path}`, async ({ page, baseURL }) => {
    const res = await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
    // rss.xml returns xml; others html
    expect(res?.ok(), `response not ok for ${path}`).toBeTruthy();

    // Basic sanity: title exists on html pages
    if (!path.endsWith('.xml')) {
      await expect(page).toHaveTitle(/.+/);
    }
  });
}
