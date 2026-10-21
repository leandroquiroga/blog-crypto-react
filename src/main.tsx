import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigErrorScreen } from '@/components/feedback/config-error';
import { checkEnv } from '@/lib/env';
import './styles/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontro el elemento #root en el documento.');
}

const root = createRoot(container);
const envCheck = checkEnv();

if (!envCheck.ok) {
  root.render(<ConfigErrorScreen message={envCheck.message} />);
} else {
  void import('./App').then(({ App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
}
