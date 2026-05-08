import { extractLinksFromText, extractTagsFromText } from '../../lib/text'
import type { BlockRecord } from '../../types'

export type DuckRow = Record<
  string,
  string | number | boolean | null | unknown[]
>

const rowsForDuckDb = (blocks: BlockRecord[]) =>
  blocks.map((block) => ({
    created_at: block.createdAt,
    id: block.id,
    links: extractLinksFromText(block.text),
    parent_id: block.parentId,
    tags: extractTagsFromText(block.text),
    text: block.text,
    updated_at: block.updatedAt,
  }))

export const defaultDuckSql = `SELECT id, text, tags, links
FROM blocks
WHERE array_length(links) > 0 OR array_length(tags) > 0
ORDER BY updated_at DESC
LIMIT 25`

export const runDuckDbQuery = async (
  blocks: BlockRecord[],
  sql: string,
): Promise<DuckRow[]> => {
  const duckdb = await import('@duckdb/duckdb-wasm')
  const bundles = duckdb.getJsDelivrBundles()
  const bundle = await duckdb.selectBundle(bundles)
  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker!}");`], {
      type: 'text/javascript',
    }),
  )
  const worker = new Worker(workerUrl)
  const logger = new duckdb.VoidLogger()
  const database = new duckdb.AsyncDuckDB(logger, worker)

  try {
    await database.instantiate(bundle.mainModule, bundle.pthreadWorker)
    await database.registerFileText(
      'blocks.json',
      JSON.stringify(rowsForDuckDb(blocks)),
    )
    const connection = await database.connect()

    try {
      await connection.query(
        `CREATE OR REPLACE VIEW blocks AS SELECT * FROM read_json_auto('blocks.json')`,
      )
      const result = await connection.query(sql)

      return result.toArray().map((row: unknown) => {
        if (row && typeof row === 'object' && 'toJSON' in row) {
          return (row as { toJSON: () => DuckRow }).toJSON()
        }

        return row as DuckRow
      })
    } finally {
      await connection.close()
    }
  } finally {
    await database.terminate()
    worker.terminate()
    URL.revokeObjectURL(workerUrl)
  }
}
