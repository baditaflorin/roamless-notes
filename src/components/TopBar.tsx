import { GitFork, Heart, Star } from 'lucide-react'
import {
  appBuildTime,
  appCommit,
  appVersion,
  paypalUrl,
  repositoryUrl,
} from '../version'

export const TopBar = () => {
  const commitUrl =
    appCommit === 'local'
      ? repositoryUrl
      : `${repositoryUrl}/commit/${appCommit}`

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
      <div>
        <a
          className="text-base font-semibold tracking-normal text-stone-950"
          href={repositoryUrl}
          rel="noreferrer"
          target="_blank"
        >
          Roamless Notes
        </a>
        <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-stone-500">
          <span>v{appVersion}</span>
          <a
            className="underline decoration-stone-300 underline-offset-2 hover:text-stone-900"
            href={commitUrl}
            rel="noreferrer"
            target="_blank"
            title={appBuildTime}
          >
            {appCommit}
          </a>
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        <a
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-800 hover:border-stone-950 hover:text-stone-950"
          href={repositoryUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Star size={16} />
          Star
        </a>
        <a
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 font-medium text-stone-800 hover:border-stone-950 hover:text-stone-950"
          href={`${repositoryUrl}/fork`}
          rel="noreferrer"
          target="_blank"
        >
          <GitFork size={16} />
          Fork
        </a>
        <a
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-3 py-2 font-medium text-white hover:bg-emerald-800"
          href={paypalUrl}
          rel="noreferrer"
          target="_blank"
        >
          <Heart size={16} />
          PayPal
        </a>
      </nav>
    </header>
  )
}
