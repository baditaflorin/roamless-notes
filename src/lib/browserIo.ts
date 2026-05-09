import type { WorkspaceState } from '../features/workspace/workspaceSchema'

export type BrowserActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string }

export const downloadText = ({
  contents,
  fileName,
  mimeType,
}: {
  contents: string
  fileName: string
  mimeType: string
}) => {
  const blob = new Blob([contents], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export const copyText = async (
  contents: string,
): Promise<BrowserActionResult> => {
  if (!navigator.clipboard?.writeText) {
    return {
      message: 'Clipboard write is not available in this browser.',
      ok: false,
    }
  }

  await navigator.clipboard.writeText(contents)
  return { message: 'Copied to clipboard.', ok: true }
}

export const readClipboardText = async () => {
  if (!navigator.clipboard?.readText) {
    throw new Error(
      'Clipboard read is not available. Paste into the text box instead.',
    )
  }

  return navigator.clipboard.readText()
}

export const createShareUrl = (state: WorkspaceState) => {
  const json = JSON.stringify(state)
  const bytes = new TextEncoder().encode(json)
  const binary = String.fromCodePoint(...bytes)
  const encoded = btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  const url = `${window.location.origin}${window.location.pathname}#workspace=${encoded}`

  if (url.length > 7000) {
    throw new Error(
      'This workspace is too large for a share URL. Export JSON instead.',
    )
  }

  return url
}

export const readShareStateFromHash = () => {
  const match = window.location.hash.match(/^#workspace=([A-Za-z0-9_-]+)$/)

  if (!match) {
    return null
  }

  const padded = match[1].padEnd(Math.ceil(match[1].length / 4) * 4, '=')
  const base64 = padded.replaceAll('-', '+').replaceAll('_', '/')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0)

  return new TextDecoder().decode(bytes)
}
