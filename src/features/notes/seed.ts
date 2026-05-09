import { createId } from '../../lib/ids'
import type { BlockRecord } from '../../types'

const now = () => new Date().toISOString()

const block = (
  text: string,
  order: number,
  parentId: string | null = null,
): BlockRecord => ({
  createdAt: now(),
  id: createId('seed'),
  order,
  parentId,
  text,
  updatedAt: now(),
})

export const createSeedBlocks = () => {
  const home = block('Roamless Notes [[Local-first]] #home', 0)
  const graph = block(
    'Bidirectional links connect [[Graph View]], [[Backlinks]], and [[Query Language]].',
    0,
    home.id,
  )
  const ai = block(
    'Semantic recall uses local sentence-transformer embeddings when you ask for it. #ai',
    1,
    home.id,
  )
  const duck = block(
    'DuckDB-WASM lets you inspect blocks as a private local table. [[DuckDB]] #sql',
    2,
    home.id,
  )
  const todo = block(
    'Task: Open the query panel and search for link:[[Graph View]]',
    3,
    home.id,
  )
  const daily = block('Daily map 2026-05-08 [[Roamless Notes]] #journal', 1)
  const note = block(
    'Backlinks appear instantly because every edit updates the local index.',
    0,
    daily.id,
  )
  const support = block(
    'If this map is useful, star https://github.com/baditaflorin/roamless-notes or support https://www.paypal.com/paypalme/florinbadita',
    2,
  )

  return [home, graph, ai, duck, todo, daily, note, support]
}
