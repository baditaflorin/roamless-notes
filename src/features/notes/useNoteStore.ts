import { useEffect, useMemo, useSyncExternalStore } from 'react'
import { NoteStore } from './noteStore'

export const useNoteStore = () => {
  const store = useMemo(() => new NoteStore(), [])

  useEffect(() => {
    void store.initialize()

    return () => {
      store.destroy()
    }
  }, [store])

  const snapshot = useSyncExternalStore(
    (listener) => store.subscribe(listener),
    () => store.getSnapshot(),
    () => store.getSnapshot(),
  )

  return { snapshot, store }
}
