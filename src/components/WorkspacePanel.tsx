import {
  Clipboard,
  Copy,
  Download,
  FileJson,
  FileText,
  Link,
  Printer,
  RotateCcw,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import {
  blocksToCsv,
  blocksToMarkdown,
  workspaceToJson,
} from '../features/workspace/exporters'
import {
  parseImportBatch,
  type ImportSource,
} from '../features/workspace/importers'
import type { NoteStore } from '../features/notes/noteStore'
import type { WorkspaceSettings } from '../features/workspace/workspaceSchema'
import {
  copyText,
  createShareUrl,
  downloadText,
  readClipboardText,
} from '../lib/browserIo'
import { messageFromError, type Notice } from '../lib/notices'
import type { BlockRecord } from '../types'

type Props = {
  addNotice: (notice: Omit<Notice, 'id'>) => void
  blocks: BlockRecord[]
  selectedId: string | null
  settings: WorkspaceSettings
  store: NoteStore
}

const today = () => new Date().toISOString().slice(0, 10)

export const WorkspacePanel = ({
  addNotice,
  blocks,
  selectedId,
  settings,
  store,
}: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [pasteText, setPasteText] = useState('')
  const [replace, setReplace] = useState(false)
  const [url, setUrl] = useState('')
  const selected = useMemo(
    () => blocks.find((block) => block.id === selectedId) ?? null,
    [blocks, selectedId],
  )

  const importSources = (sources: ImportSource[]) => {
    const result = parseImportBatch(sources)
    let importedBlocks = 0

    for (const success of result.successes) {
      if (success.importData.kind === 'workspace' && replace) {
        store.importWorkspace(success.importData.state)
        importedBlocks += success.importData.state.blocks.length
      } else if (success.importData.kind === 'workspace') {
        store.appendBlocks(success.importData.state.blocks)
        importedBlocks += success.importData.state.blocks.length
      } else {
        store.appendBlocks(success.importData.blocks)
        importedBlocks += success.importData.blocks.length
      }
    }

    if (result.successes.length > 0) {
      addNotice({
        message: `${importedBlocks} blocks imported from ${result.successes.length} source(s).`,
        title: 'Import complete',
        tone: 'success',
      })
    }

    for (const failure of result.failures) {
      addNotice({
        message: `${failure.sourceName}: ${failure.message}`,
        title: 'Import failed',
        tone: 'error',
      })
    }
  }

  const importFiles = async (files: FileList | File[]) => {
    const sources = await Promise.all(
      [...files].map(async (file) => ({
        content: await file.text(),
        fileName: file.name,
        mimeType: file.type,
        sourceName: file.name,
      })),
    )
    importSources(sources)
  }

  const exportState = store.exportWorkspace()
  const markdown = blocksToMarkdown(blocks)

  const notifyCopy = async (text: string, title: string) => {
    try {
      const result = await copyText(text)
      addNotice({
        message: result.message,
        title,
        tone: result.ok ? 'success' : 'error',
      })
    } catch (caught) {
      addNotice({
        message: messageFromError(caught, 'Clipboard copy failed'),
        title,
        tone: 'error',
      })
    }
  }

  const fetchUrl = async () => {
    if (!url.trim()) {
      return
    }

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      importSources([
        {
          content: await response.text(),
          fileName: new URL(url).pathname.split('/').pop() || 'url-import.html',
          mimeType: response.headers.get('content-type') ?? undefined,
          sourceName: url,
        },
      ])
    } catch (caught) {
      addNotice({
        message: `${messageFromError(caught, 'URL import failed')}. If the site blocks browser fetches, paste the rendered text or HTML instead.`,
        title: 'URL import blocked',
        tone: 'error',
      })
    }
  }

  return (
    <section
      className="border-b border-stone-200 bg-white"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        const files = event.dataTransfer.files
        const text = event.dataTransfer.getData('text/plain')

        if (files.length > 0) {
          void importFiles(files)
        } else if (text) {
          importSources([
            {
              content: text,
              sourceName: 'Dropped text',
            },
          ])
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <button
          className="secondary-button"
          onClick={() => fileRef.current?.click()}
          type="button"
        >
          <Upload size={16} />
          Import
        </button>
        <button
          className="secondary-button"
          onClick={() =>
            downloadText({
              contents: workspaceToJson(exportState),
              fileName: `roamless-notes-${today()}.json`,
              mimeType: 'application/json',
            })
          }
          type="button"
        >
          <FileJson size={16} />
          JSON
        </button>
        <button
          className="secondary-button"
          onClick={() =>
            downloadText({
              contents: markdown,
              fileName: `roamless-notes-${today()}.md`,
              mimeType: 'text/markdown',
            })
          }
          type="button"
        >
          <FileText size={16} />
          MD
        </button>
        <button
          className="secondary-button"
          onClick={() =>
            downloadText({
              contents: blocksToCsv(blocks),
              fileName: `roamless-notes-${today()}.csv`,
              mimeType: 'text/csv',
            })
          }
          type="button"
        >
          <Download size={16} />
          CSV
        </button>
        <button
          className="secondary-button"
          onClick={() => void notifyCopy(markdown, 'Markdown copied')}
          type="button"
        >
          <Copy size={16} />
          Copy
        </button>
        <button
          className="secondary-button"
          onClick={() => {
            try {
              void notifyCopy(createShareUrl(exportState), 'Share link copied')
            } catch (caught) {
              addNotice({
                message: messageFromError(
                  caught,
                  'Could not create share link',
                ),
                title: 'Share link too large',
                tone: 'error',
              })
            }
          }}
          type="button"
        >
          <Link size={16} />
          Share
        </button>
        <button
          className="secondary-button"
          onClick={() => window.print()}
          type="button"
        >
          <Printer size={16} />
          Print
        </button>
      </div>

      <details className="border-t border-stone-100 px-3 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          Import from files, paste, clipboard, URL, or drop zone
        </summary>
        <div className="mt-3 grid gap-3">
          <input
            ref={fileRef}
            accept=".json,.md,.markdown,.txt,.html,text/*,application/json,text/html,text/markdown"
            className="hidden"
            multiple
            onChange={(event) => {
              const files = event.target.files

              if (files) {
                void importFiles(files)
              }
            }}
            type="file"
          />
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              checked={replace}
              onChange={(event) => setReplace(event.target.checked)}
              type="checkbox"
            />
            Replace workspace when importing a full JSON state
          </label>
          <textarea
            className="input min-h-24"
            onChange={(event) => setPasteText(event.target.value)}
            placeholder="Paste plain text, Markdown, HTML, or Roamless JSON here."
            value={pasteText}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className="primary-button"
              onClick={() =>
                importSources([
                  {
                    content: pasteText,
                    sourceName: 'Pasted text',
                  },
                ])
              }
              type="button"
            >
              Import pasted text
            </button>
            <button
              className="secondary-button"
              onClick={async () => {
                try {
                  importSources([
                    {
                      content: await readClipboardText(),
                      sourceName: 'Clipboard',
                    },
                  ])
                } catch (caught) {
                  addNotice({
                    message: messageFromError(
                      caught,
                      'Clipboard import failed',
                    ),
                    title: 'Clipboard unavailable',
                    tone: 'error',
                  })
                }
              }}
              type="button"
            >
              <Clipboard size={16} />
              Read clipboard
            </button>
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/notes.html"
              type="url"
              value={url}
            />
            <button
              className="secondary-button"
              onClick={() => void fetchUrl()}
              type="button"
            >
              Fetch URL
            </button>
          </div>
        </div>
      </details>

      <details className="border-t border-stone-100 px-3 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          Workspace settings
        </summary>
        <div className="mt-3 grid gap-2 text-sm text-stone-700">
          <SettingCheckbox
            checked={settings.compactEditor}
            label="Compact editor rows"
            onChange={(compactEditor) =>
              store.updateSettings({ compactEditor })
            }
          />
          <SettingCheckbox
            checked={settings.showGraphLabels}
            label="Show graph labels"
            onChange={(showGraphLabels) =>
              store.updateSettings({ showGraphLabels })
            }
          />
          <SettingCheckbox
            checked={settings.fuzzySearch}
            label="Fuzzy search matching"
            onChange={(fuzzySearch) => store.updateSettings({ fuzzySearch })}
          />
          <SettingCheckbox
            checked={settings.confirmDestructiveActions}
            label="Confirm destructive workspace actions"
            onChange={(confirmDestructiveActions) =>
              store.updateSettings({ confirmDestructiveActions })
            }
          />
        </div>
      </details>

      <div className="flex flex-wrap gap-2 border-t border-stone-100 px-3 py-2">
        <button
          className="secondary-button"
          onClick={() => {
            if (
              settings.confirmDestructiveActions &&
              !window.confirm(
                'Load the demo notebook and replace current notes?',
              )
            ) {
              return
            }
            store.resetDemo()
            addNotice({
              message: 'Demo notebook loaded.',
              title: 'Demo loaded',
              tone: 'success',
            })
          }}
          type="button"
        >
          <RotateCcw size={16} />
          Load demo
        </button>
        <button
          className="secondary-button text-red-700"
          onClick={() => {
            if (
              settings.confirmDestructiveActions &&
              !window.confirm('Start fresh and clear all current notes?')
            ) {
              return
            }
            store.clearWorkspace()
            addNotice({
              message: 'Workspace cleared.',
              title: 'Started fresh',
              tone: 'success',
            })
          }}
          type="button"
        >
          <Trash2 size={16} />
          Start fresh
        </button>
        <button
          className="secondary-button"
          disabled={!selected}
          onClick={() =>
            void notifyCopy(selected?.text ?? '', 'Selected block copied')
          }
          type="button"
        >
          <Copy size={16} />
          Copy selected
        </button>
        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
          <Settings size={14} />
          {blocks.length} blocks
        </span>
      </div>
    </section>
  )
}

const SettingCheckbox = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}) => (
  <label className="flex items-center gap-2">
    <input
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      type="checkbox"
    />
    {label}
  </label>
)
