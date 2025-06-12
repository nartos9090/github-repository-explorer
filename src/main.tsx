import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import AppPage from './app/page'
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <AppPage />
  </StrictMode>,
)
