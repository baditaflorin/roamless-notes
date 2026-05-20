import { expect, test } from '@playwright/test'

test('loads the local notes map and indexes a new block', async ({ page }) => {
  await page.goto('/roamless-notes/')

  await expect(page.getByRole('link', { name: 'Roamless Notes' })).toBeVisible()
  await expect(page.getByText('v0.2.0')).toBeVisible()

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

test('imports real notes, exports, copies, prints, and persists settings', async ({
  page,
}) => {
  await page.goto('/roamless-notes/')
  await page.evaluate(() => {
    window.print = () => document.body.setAttribute('data-printed', 'yes')
  })

  await page
    .locator('input[type="file"]')
    .setInputFiles('test/fixtures/real-notes.md')
  await expect(page.getByText('Import complete')).toBeVisible()
  await expect(page.getByText('Call Alice about [[Research]]')).toBeVisible()

  await page.getByText('Workspace settings').click()
  await page.getByLabel('Compact editor rows').check()
  await page.reload()
  await page.evaluate(() => {
    window.print = () => document.body.setAttribute('data-printed', 'yes')
  })
  await page.getByText('Workspace settings').click()
  await expect(page.getByLabel('Compact editor rows')).toBeChecked()

  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'MD' }).click()
  await expect((await download).suggestedFilename()).toContain('.md')

  await page.getByRole('button', { name: 'Copy', exact: true }).click()
  await expect(page.getByText('Markdown copied')).toBeVisible()

  await page.getByRole('button', { name: 'Print' }).click()
  await expect(page.locator('body')).toHaveAttribute('data-printed', 'yes')
})
