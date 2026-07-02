import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary - Catches errors in child components and displays fallback UI
 * Prevents entire app crash when a single component fails
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="glass-panel w-full max-w-lg rounded-[28px] p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-slate-900">Something went wrong</h1>
            <p className="mb-6 text-slate-500">
              We encountered an unexpected error. You can retry or return to the home page.
            </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-left">
                  <h3 className="mb-2 font-bold text-red-800">Error Details (Development Only)</h3>
                  <pre className="max-h-40 overflow-auto text-xs text-red-700">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

            <div className="flex gap-3">
              <button
                onClick={this.resetError}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <a
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:scale-[1.02]"
              >
                <Home className="h-4 w-4" />
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
