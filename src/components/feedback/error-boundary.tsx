import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './error-state';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary capturo un error', error, info.componentStack);
  }

  private readonly handleReset = () => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;

    if (error) {
      return (
        <div className="mx-auto max-w-xl px-4 py-10">
          <ErrorState
            title="La aplicacion encontro un problema"
            message={error.message}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
