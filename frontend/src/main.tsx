import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { OverlayProvider } from 'overlay-kit';
import { ReactQueryProvider } from '@app/providers';
import App from './App';
import '@app/styles/globals.css';
import '@app/styles/font.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </StrictMode>
);
