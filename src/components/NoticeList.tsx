import type { Notice } from '../lib/notices'

export const NoticeList = ({
  notices,
  onDismiss,
}: {
  notices: Notice[]
  onDismiss: (id: string) => void
}) => (
  <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
    {notices.map((notice) => (
      <section
        className={`pointer-events-auto rounded-md border p-3 shadow-lg ${
          notice.tone === 'error'
            ? 'border-red-200 bg-red-50 text-red-950'
            : notice.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
              : 'border-sky-200 bg-sky-50 text-sky-950'
        }`}
        key={notice.id}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">{notice.title}</h2>
            <p className="mt-1 text-sm">{notice.message}</p>
          </div>
          <button
            className="text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
            onClick={() => onDismiss(notice.id)}
            type="button"
          >
            Close
          </button>
        </div>
      </section>
    ))}
  </div>
)
