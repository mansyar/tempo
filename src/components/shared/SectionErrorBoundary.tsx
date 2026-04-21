import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  name: string;
}

interface State {
  hasError: boolean;
}

class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Uncaught error in ${this.props.name}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[var(--danger)] rounded-2xl bg-[var(--danger)]/5 text-center rise-in">
          <AlertCircle className="w-10 h-10 text-[var(--danger)] mb-4 opacity-80" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            An error occurred in {this.props.name}.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-glass)] text-[var(--text-primary)] rounded-lg font-semibold transition-all border border-[var(--border-subtle)]"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
