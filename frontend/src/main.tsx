import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', fontFamily: 'sans-serif', background: '#fee2e2', color: '#991b1b', margin: '20px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>System Error: UI Rendering Failure</h2>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>{this.state.error?.message}</p>
          <pre style={{ marginTop: '12px', background: '#fff', padding: '12px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}

