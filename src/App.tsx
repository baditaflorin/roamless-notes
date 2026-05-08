import { useState } from 'react'
import { BlockEditor } from './components/BlockEditor'
import { GraphPanel } from './components/GraphPanel'
import { SearchPanel, type ExplorerTab } from './components/SearchPanel'
import { TopBar } from './components/TopBar'
import { useNoteStore } from './features/notes/useNoteStore'

export default function App() {
  const { snapshot, store } = useNoteStore()
  const [explorerTab, setExplorerTab] = useState<ExplorerTab>('search')
  const [blockQuery, setBlockQuery] = useState('link:[[Graph View]]')

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
      <main className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(420px,1.25fr)_minmax(320px,0.85fr)_minmax(320px,0.9fr)]">
        <BlockEditor
          selectedId={snapshot.selectedId}
          store={store}
          tree={tree}
        />
        <SearchPanel
          activeTab={explorerTab}
          blockQuery={blockQuery}
          blocks={snapshot.blocks}
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
        />
      </main>
    </div>
  )
}
