import type { BlockRecord } from '../../types'

export type SemanticEntry = {
  blockId: string
  embedding: number[]
  text: string
}

export type SemanticHit = {
  block: BlockRecord
  score: number
}

let extractorPromise: Promise<(text: string) => Promise<number[]>> | undefined

const getExtractor = () => {
  extractorPromise ??= import('@huggingface/transformers').then(
    async ({ env, pipeline }) => {
      env.allowLocalModels = false
      const extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      )

      return async (text: string) => {
        const output = (await extractor(text, {
          normalize: true,
          pooling: 'mean',
        })) as unknown
        const tensor = output as {
          data?: Iterable<number>
          tolist?: () => number[][]
        }
        const data = tensor.data ?? tensor.tolist?.()[0] ?? []

        return Array.from(data as Iterable<number>)
      }
    },
  )

  return extractorPromise
}

const cosine = (first: number[], second: number[]) =>
  first.reduce((sum, value, index) => sum + value * (second[index] ?? 0), 0)

export const buildSemanticIndex = async (
  blocks: BlockRecord[],
  onProgress?: (done: number, total: number) => void,
) => {
  const embed = await getExtractor()
  const entries: SemanticEntry[] = []

  for (const [index, block] of blocks.entries()) {
    if (block.text.trim()) {
      entries.push({
        blockId: block.id,
        embedding: await embed(block.text),
        text: block.text,
      })
    }

    onProgress?.(index + 1, blocks.length)
  }

  return entries
}

export const semanticSearch = async (
  blocks: BlockRecord[],
  index: SemanticEntry[],
  query: string,
): Promise<SemanticHit[]> => {
  const embed = await getExtractor()
  const queryVector = await embed(query)
  const byId = new Map(blocks.map((block) => [block.id, block]))

  return index
    .map((entry) => ({
      block: byId.get(entry.blockId),
      score: cosine(queryVector, entry.embedding),
    }))
    .filter((hit): hit is SemanticHit => Boolean(hit.block))
    .sort((first, second) => second.score - first.score)
    .slice(0, 8)
}

export const summarizeLocally = async (text: string) => {
  try {
    const { env, pipeline } = await import('@huggingface/transformers')
    env.allowLocalModels = false
    const summarizer = await pipeline(
      'summarization',
      'Xenova/distilbart-cnn-6-6',
    )
    const result = await summarizer(text.slice(0, 4000), {
      max_new_tokens: 96,
      min_length: 24,
    })
    const first = Array.isArray(result) ? result[0] : result

    if (first && typeof first === 'object' && 'summary_text' in first) {
      return String(first.summary_text)
    }
  } catch {
    // Fall through to the deterministic local fallback below.
  }

  return text
    .split(/[.!?]\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join('. ')
}
