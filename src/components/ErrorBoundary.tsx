import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  message: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null }

  static getDerivedStateFromError(error: Error) {
    return { message: error.message }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void error
    void errorInfo
    return undefined
  }

  render() {
    if (this.state.message) {
      return (
        <main className="grid min-h-screen place-items-center bg-stone-50 p-8 text-stone-950">
          <section className="max-w-lg rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold">Roamless Notes paused</h1>
            <p className="mt-3 text-sm text-stone-700">{this.state.message}</p>
            <button
              className="mt-5 rounded-md bg-stone-950 px-4 py-2 text-sm font-medium text-white"
              onClick={() => window.location.reload()}
              type="button"
            >
              Reload
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
