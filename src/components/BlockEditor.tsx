import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Plus,
  Trash2,
} from 'lucide-react'
import type { NoteStore } from '../features/notes/noteStore'
import { flattenTree } from '../features/notes/tree'
import type { BlockTreeNode } from '../types'

type Props = {
  compact: boolean
  store: NoteStore
  tree: BlockTreeNode[]
  selectedId: string | null
}

const focusBlock = (id: string) => {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLTextAreaElement>(`[data-block-id="${id}"]`)
      ?.focus()
  })
}

export const BlockEditor = ({ compact, store, tree, selectedId }: Props) => {
  const flat = flattenTree(tree)

  return (
    <section className="flex min-h-0 flex-1 flex-col border-r border-stone-200 bg-stone-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 bg-white px-3 py-2">
        <button
          aria-label="New root block"
          className="icon-button"
          onClick={() => focusBlock(store.addBlock(null) ?? '')}
          title="New root block"
          type="button"
        >
          <Plus size={16} />
        </button>
        <span className="text-xs text-stone-500">
          Enter adds a sibling. Tab indents.
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
        {flat.map((block) => (
          <BlockRow
            block={block}
            key={block.id}
            compact={compact}
            selected={selectedId === block.id}
            store={store}
          />
        ))}
      </div>
    </section>
  )
}

type RowProps = {
  block: BlockTreeNode
  compact: boolean
  selected: boolean
  store: NoteStore
}

const BlockRow = ({ block, compact, selected, store }: RowProps) => {
  const addAfter = () =>
    focusBlock(store.addBlock(block.parentId, block.id) ?? '')

  return (
    <article
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-2 py-1"
      style={{ paddingLeft: `${Math.min(block.depth, 7) * 18}px` }}
    >
      <span className="mt-3 h-2 w-2 rounded-full bg-stone-400" />
      <textarea
        className={`block-field ${selected ? 'block-field-selected' : ''}`}
        data-block-id={block.id}
        onChange={(event) => store.updateBlock(block.id, event.target.value)}
        onFocus={() => store.selectBlock(block.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            addAfter()
          }

          if (event.key === 'Tab') {
            event.preventDefault()
            if (event.shiftKey) {
              store.outdentBlock(block.id)
            } else {
              store.indentBlock(block.id)
            }
          }

          if (event.metaKey && event.key === 'ArrowUp') {
            event.preventDefault()
            store.moveBlock(block.id, -1)
          }

          if (event.metaKey && event.key === 'ArrowDown') {
            event.preventDefault()
            store.moveBlock(block.id, 1)
          }

          if (event.key === 'Backspace' && !block.text.trim()) {
            event.preventDefault()
            store.deleteBlock(block.id)
          }
        }}
        rows={compact ? 1 : Math.max(1, Math.ceil(block.text.length / 74))}
        value={block.text}
      />
      <div className="flex opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
        <button
          aria-label="Move up"
          className="mini-button"
          onClick={() => store.moveBlock(block.id, -1)}
          title="Move up"
          type="button"
        >
          <ArrowUp size={14} />
        </button>
        <button
          aria-label="Move down"
          className="mini-button"
          onClick={() => store.moveBlock(block.id, 1)}
          title="Move down"
          type="button"
        >
          <ArrowDown size={14} />
        </button>
        <button
          aria-label="Outdent"
          className="mini-button"
          onClick={() => store.outdentBlock(block.id)}
          title="Outdent"
          type="button"
        >
          <ArrowLeft size={14} />
        </button>
        <button
          aria-label="Indent"
          className="mini-button"
          onClick={() => store.indentBlock(block.id)}
          title="Indent"
          type="button"
        >
          <ArrowRight size={14} />
        </button>
        <button
          aria-label="Delete"
          className="mini-button text-red-700"
          onClick={() => store.deleteBlock(block.id)}
          title="Delete"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  )
}
