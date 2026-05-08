import { expect, test } from '@playwright/test'

test('loads the local notes map and indexes a new block', async ({ page }) => {
  await page.goto('/roamless-notes/')

  await expect(page.getByRole('link', { name: 'Roamless Notes' })).toBeVisible()
  await expect(page.getByText('v0.1.0')).toBeVisible()

  await page.getByLabel('New root block').click()

  const newBlock = page.locator('textarea').last()
  await newBlock.fill('A fresh [[Playwright]] #smoke block')

  await page.getByLabel('Full text search').fill('Playwright')
  await expect(
    page.getByRole('button', {
      name: /A fresh \[\[Playwright\]\] #smoke block/,
    }),
  ).toBeVisible()
})
