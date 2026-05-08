import { Network } from 'lucide-react'
import { useMemo } from 'react'
import { buildGraph } from '../features/graph/graphModel'
import {
  blockTitle,
  extractLinksFromText,
  extractTagsFromText,
} from '../lib/text'
import type { BlockRecord, GraphNode } from '../types'

type Props = {
  blocks: BlockRecord[]
  selectedId: string | null
  onConceptQuery: (query: string) => void
  onSelectBlock: (id: string) => void
}

export const GraphPanel = ({
  blocks,
  selectedId,
  onConceptQuery,
  onSelectBlock,
}: Props) => {
  const graph = useMemo(() => buildGraph(blocks), [blocks])
  const selected = blocks.find((block) => block.id === selectedId) ?? blocks[0]
  const links = selected ? extractLinksFromText(selected.text) : []
  const tags = selected ? extractTagsFromText(selected.text) : []
  const incoming = selected
    ? blocks.filter((block) =>
        extractLinksFromText(block.text)
          .map((link) => link.toLowerCase())
          .includes(blockTitle(selected).toLowerCase()),
      )
    : []
  const positions = useMemo(() => layoutNodes(graph.nodes), [graph.nodes])

  return (
    <aside className="flex min-h-0 flex-col bg-stone-950 text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <Network size={17} />
        <h2 className="text-sm font-semibold">Map</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <svg
          aria-label="Graph view"
          className="h-[360px] w-full border-b border-white/10 bg-stone-900"
          viewBox="0 0 640 360"
        >
          {graph.edges.map((edge) => {
            const source = positions.get(edge.source)
            const target = positions.get(edge.target)

            if (!source || !target) {
              return null
            }

            return (
              <line
                key={edge.id}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
                x1={source.x}
                x2={target.x}
                y1={source.y}
                y2={target.y}
              />
            )
          })}
          {graph.nodes.map((node) => {
            const point = positions.get(node.id)

            if (!point) {
              return null
            }

            const selectedNode = node.blockId === selectedId
            const color =
              node.kind === 'tag'
                ? '#22c55e'
                : node.kind === 'concept'
                  ? '#38bdf8'
                  : '#f8fafc'

            return (
              <g
                className="cursor-pointer"
                key={node.id}
                onClick={() => {
                  if (node.blockId) {
                    onSelectBlock(node.blockId)
                  } else if (node.kind === 'tag') {
                    onConceptQuery(`tag:${node.label}`)
                  } else {
                    onConceptQuery(`link:[[${node.label}]]`)
                  }
                }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill={color}
                  opacity={selectedNode ? 1 : 0.86}
                  r={selectedNode ? 8 : node.kind === 'block' ? 5 : 7}
                />
                <text
                  fill="rgba(255,255,255,0.78)"
                  fontSize="10"
                  textAnchor="middle"
                  x={point.x}
                  y={point.y + 18}
                >
                  {node.label.length > 18
                    ? `${node.label.slice(0, 16)}...`
                    : node.label}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="space-y-5 p-4">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Selected
            </h3>
            <p className="text-sm text-stone-100">
              {selected ? blockTitle(selected) : 'None'}
            </p>
          </section>
          <ChipSection
            chips={links.map((link) => ({
              label: link,
              query: `link:[[${link}]]`,
            }))}
            empty="No outgoing links"
            onConceptQuery={onConceptQuery}
            title="Links"
          />
          <ChipSection
            chips={tags.map((tag) => ({
              label: tag,
              query: `tag:${tag}`,
            }))}
            empty="No tags"
            onConceptQuery={onConceptQuery}
            title="Tags"
          />
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
              Backlinks
            </h3>
            <div className="space-y-2">
              {incoming.map((block) => (
                <button
                  className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-left text-sm text-stone-100 hover:bg-white/10"
                  key={block.id}
                  onClick={() => onSelectBlock(block.id)}
                  type="button"
                >
                  {blockTitle(block)}
                </button>
              ))}
              {incoming.length === 0 ? (
                <p className="text-sm text-stone-500">No backlinks</p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </aside>
  )
}

const ChipSection = ({
  chips,
  empty,
  onConceptQuery,
  title,
}: {
  chips: { label: string; query: string }[]
  empty: string
  onConceptQuery: (query: string) => void
  title: string
}) => (
  <section>
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
          key={chip.query}
          onClick={() => onConceptQuery(chip.query)}
          type="button"
        >
          {chip.label}
        </button>
      ))}
      {chips.length === 0 ? (
        <p className="text-sm text-stone-500">{empty}</p>
      ) : null}
    </div>
  </section>
)

const layoutNodes = (nodes: GraphNode[]) => {
  const points = new Map<string, { x: number; y: number }>()
  const center = { x: 320, y: 178 }
  const concepts = nodes.filter((node) => node.kind !== 'block')
  const blocks = nodes.filter((node) => node.kind === 'block')

  concepts.forEach((node, index) => {
    const angle =
      (Math.PI * 2 * index) / Math.max(concepts.length, 1) - Math.PI / 2
    points.set(node.id, {
      x: center.x + Math.cos(angle) * 105,
      y: center.y + Math.sin(angle) * 82,
    })
  })

  blocks.forEach((node, index) => {
    const angle =
      (Math.PI * 2 * index) / Math.max(blocks.length, 1) - Math.PI / 2
    points.set(node.id, {
      x: center.x + Math.cos(angle) * 245,
      y: center.y + Math.sin(angle) * 132,
    })
  })

  return points
}
