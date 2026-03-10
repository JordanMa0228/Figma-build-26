import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="max-w-md text-sm text-slate-500">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload application"
            className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

