import { useCallback, useEffect, useState } from 'react'
import { BlockEditor } from './components/BlockEditor'
import { GraphPanel } from './components/GraphPanel'
import { NoticeList } from './components/NoticeList'
import { SearchPanel, type ExplorerTab } from './components/SearchPanel'
import { TopBar } from './components/TopBar'
import { WorkspacePanel } from './components/WorkspacePanel'
import { useNoteStore } from './features/notes/useNoteStore'
import { normalizeWorkspaceState } from './features/workspace/workspaceSchema'
import { readShareStateFromHash } from './lib/browserIo'
import { createNotice, messageFromError, type Notice } from './lib/notices'

export default function App() {
  const { snapshot, store } = useNoteStore()
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>('search')
  const [blockQuery, setBlockQuery] = useState('link:[[Graph View]]')
  const [notices, setNotices] = useState<Notice[]>([])

  const addNotice = useCallback((notice: Omit<Notice, 'id'>) => {
    const next = createNotice(notice)
    setNotices((current) => [next, ...current].slice(0, 4))
    window.setTimeout(() => {
      setNotices((current) => current.filter((item) => item.id !== next.id))
    }, 7000)
  }, [])

  useEffect(() => {
    if (!snapshot.ready) {
      return
    }

    const shared = readShareStateFromHash()

    if (!shared) {
      return
    }

    try {
      store.importWorkspace(normalizeWorkspaceState(JSON.parse(shared)))
      window.history.replaceState(null, '', window.location.pathname)
      window.setTimeout(() => {
        addNotice({
          message: 'Shared workspace loaded from the URL.',
          title: 'Share import complete',
          tone: 'success',
        })
      }, 0)
    } catch (caught) {
      window.setTimeout(() => {
        addNotice({
          message: messageFromError(caught, 'Could not load shared workspace.'),
          title: 'Share import failed',
          tone: 'error',
        })
      }, 0)
    }
  }, [addNotice, snapshot.ready, store])

  if (!snapshot.ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-950 text-white">
        <div className="h-10 w-10 animate-pulse rounded-full bg-emerald-400" />
      </main>
    )
  }

  const tree = store.getTree()

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 text-stone-950">
      <TopBar />
      <NoticeList
        notices={notices}
        onDismiss={(id) =>
          setNotices((current) => current.filter((notice) => notice.id !== id))
        }
      />
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(420px,1.25fr)_minmax(320px,0.85fr)_minmax(320px,0.9fr)]">
        <section className="flex min-h-0 flex-col">
          <WorkspacePanel
            addNotice={addNotice}
            blocks={snapshot.blocks}
            selectedId={snapshot.selectedId}
            settings={snapshot.settings}
            store={store}
          />
          <BlockEditor
            compact={snapshot.settings.compactEditor}
            selectedId={snapshot.selectedId}
            store={store}
            tree={tree}
          />
        </section>
        <SearchPanel
          activeTab={explorerTab}
          addNotice={addNotice}
          blockQuery={blockQuery}
          blocks={snapshot.blocks}
          fuzzySearch={snapshot.settings.fuzzySearch}
          onBlockQueryChange={setBlockQuery}
          onSelectBlock={(id) => store.selectBlock(id)}
          onTabChange={setExplorerTab}
        />
        <GraphPanel
          blocks={snapshot.blocks}
          onConceptQuery={(query) => {
            setBlockQuery(query)
            setExplorerTab('query')
          }}
          onSelectBlock={(id) => store.selectBlock(id)}
          selectedId={snapshot.selectedId}
          showLabels={snapshot.settings.showGraphLabels}
        />
      </main>
    </div>
  )
}
