import { Database, Search, Sparkles } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import {
  defaultDuckSql,
  runDuckDbQuery,
  type DuckRow,
} from '../features/duckdb/duckdbClient'
import { runBlockQuery } from '../features/query/queryLanguage'
import { createSearchIndex, searchBlocks } from '../features/search/searchIndex'
import {
  buildSemanticIndex,
  semanticSearch,
  summarizeLocally,
  type SemanticEntry,
  type SemanticHit,
} from '../features/semantic/semanticClient'
import { blockTitle } from '../lib/text'
import type { BlockRecord } from '../types'

type Props = {
  activeTab: ExplorerTab
  blocks: BlockRecord[]
  blockQuery: string
  onBlockQueryChange: (query: string) => void
  onSelectBlock: (id: string) => void
  onTabChange: (tab: ExplorerTab) => void
}

export type ExplorerTab = 'search' | 'query' | 'sql' | 'semantic'

export const SearchPanel = ({
  activeTab,
  blocks,
  blockQuery,
  onBlockQueryChange,
  onSelectBlock,
  onTabChange,
}: Props) => {
  const [search, setSearch] = useState('graph')
  const index = useMemo(() => createSearchIndex(blocks), [blocks])
  const searchHits = useMemo(
    () => searchBlocks(index, blocks, search),
    [blocks, index, search],
  )
  const queryHits = useMemo(
    () => runBlockQuery(blocks, blockQuery),
    [blocks, blockQuery],
  )

  return (
    <section className="flex min-h-0 flex-col border-r border-stone-200 bg-white">
      <div className="grid grid-cols-4 border-b border-stone-200">
        <TabButton
          active={activeTab === 'search'}
          icon={<Search size={15} />}
          onClick={() => onTabChange('search')}
        />
        <TabButton
          active={activeTab === 'query'}
          label="QL"
          onClick={() => onTabChange('query')}
        />
        <TabButton
          active={activeTab === 'sql'}
          icon={<Database size={15} />}
          onClick={() => onTabChange('sql')}
        />
        <TabButton
          active={activeTab === 'semantic'}
          icon={<Sparkles size={15} />}
          onClick={() => onTabChange('semantic')}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {activeTab === 'search' ? (
          <div className="space-y-3">
            <input
              aria-label="Full text search"
              className="input"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              value={search}
            />
            <ResultList
              items={searchHits.map((hit) => ({
                id: hit.block.id,
                meta: hit.terms.join(', '),
                text: hit.block.text,
              }))}
              onSelect={onSelectBlock}
            />
          </div>
        ) : null}
        {activeTab === 'query' ? (
          <div className="space-y-3">
            <input
              aria-label="Block query"
              className="input"
              onChange={(event) => onBlockQueryChange(event.target.value)}
              placeholder="tag:#home link:[[Graph View]] todo"
              value={blockQuery}
            />
            <ResultList
              items={queryHits.map((hit) => ({
                id: hit.block.id,
                meta: hit.reason,
                text: hit.block.text,
              }))}
              onSelect={onSelectBlock}
            />
          </div>
        ) : null}
        {activeTab === 'sql' ? <DuckPanel blocks={blocks} /> : null}
        {activeTab === 'semantic' ? (
          <SemanticPanel blocks={blocks} onSelectBlock={onSelectBlock} />
        ) : null}
      </div>
    </section>
  )
}

type TabProps = {
  active: boolean
  icon?: ReactNode
  label?: string
  onClick: () => void
}

const TabButton = ({ active, icon, label, onClick }: TabProps) => (
  <button
    className={`grid h-11 place-items-center border-r border-stone-200 text-sm font-semibold last:border-r-0 ${
      active ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-100'
    }`}
    onClick={onClick}
    type="button"
  >
    {icon ?? label}
  </button>
)

type ResultItem = {
  id: string
  meta: string
  text: string
}

const ResultList = ({
  items,
  onSelect,
}: {
  items: ResultItem[]
  onSelect: (id: string) => void
}) => (
  <div className="space-y-2">
    {items.map((item) => (
      <button
        className="result-row"
        key={item.id}
        onClick={() => onSelect(item.id)}
        type="button"
      >
        <span className="line-clamp-3 text-left text-sm text-stone-900">
          {item.text || 'Untitled'}
        </span>
        <span className="mt-1 block text-left text-xs text-stone-500">
          {item.meta}
        </span>
      </button>
    ))}
    {items.length === 0 ? (
      <p className="rounded-md border border-dashed border-stone-300 p-4 text-sm text-stone-500">
        No matches
      </p>
    ) : null}
  </div>
)

const DuckPanel = ({ blocks }: { blocks: BlockRecord[] }) => {
  const [sql, setSql] = useState(defaultDuckSql)
  const [rows, setRows] = useState<DuckRow[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setBusy(true)
    setError(null)

    try {
      setRows(await runDuckDbQuery(blocks, sql))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'DuckDB query failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        aria-label="DuckDB SQL"
        className="input min-h-40 font-mono text-xs"
        onChange={(event) => setSql(event.target.value)}
        value={sql}
      />
      <button
        className="primary-button"
        disabled={busy}
        onClick={() => void run()}
        type="button"
      >
        {busy ? 'Running' : 'Run SQL'}
      </button>
      {error ? <p className="panel-error">{error}</p> : null}
      {rows.length > 0 ? (
        <div className="overflow-auto rounded-md border border-stone-200">
          <table className="w-full border-collapse text-left text-xs">
            <tbody>
              {rows.map((row, index) => (
                <tr
                  className="border-b border-stone-100 last:border-b-0"
                  key={index}
                >
                  <td className="whitespace-pre-wrap p-2 font-mono">
                    {JSON.stringify(row, null, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

const SemanticPanel = ({
  blocks,
  onSelectBlock,
}: {
  blocks: BlockRecord[]
  onSelectBlock: (id: string) => void
}) => {
  const [semanticIndex, setSemanticIndex] = useState<SemanticEntry[]>([])
  const [progress, setProgress] = useState('')
  const [query, setQuery] = useState('local knowledge graph')
  const [hits, setHits] = useState<SemanticHit[]>([])
  const [summary, setSummary] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const build = async () => {
    setBusy(true)
    setError(null)

    try {
      setSemanticIndex(
        await buildSemanticIndex(blocks, (done, total) =>
          setProgress(`${done}/${total}`),
        ),
      )
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Model loading failed',
      )
    } finally {
      setBusy(false)
    }
  }

  const search = async () => {
    setBusy(true)
    setError(null)

    try {
      const nextIndex =
        semanticIndex.length > 0
          ? semanticIndex
          : await buildSemanticIndex(blocks)
      setSemanticIndex(nextIndex)
      setHits(await semanticSearch(blocks, nextIndex, query))
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Semantic search failed',
      )
    } finally {
      setBusy(false)
    }
  }

  const summarize = async () => {
    setBusy(true)
    setError(null)

    try {
      setSummary(
        await summarizeLocally(blocks.map((block) => block.text).join('\n')),
      )
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Summary failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          className="primary-button"
          disabled={busy}
          onClick={() => void build()}
          type="button"
        >
          Index
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => void summarize()}
          type="button"
        >
          Summarize
        </button>
      </div>
      <input
        aria-label="Semantic search"
        className="input"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
      <button
        className="primary-button"
        disabled={busy}
        onClick={() => void search()}
        type="button"
      >
        {busy ? 'Working' : 'Search'}
      </button>
      {progress ? (
        <p className="text-xs text-stone-500">Indexed {progress}</p>
      ) : null}
      {error ? <p className="panel-error">{error}</p> : null}
      {summary ? (
        <p className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
          {summary}
        </p>
      ) : null}
      <ResultList
        items={hits.map((hit) => ({
          id: hit.block.id,
          meta: `${Math.round(hit.score * 100)} · ${blockTitle(hit.block)}`,
          text: hit.block.text,
        }))}
        onSelect={onSelectBlock}
      />
    </div>
  )
}
