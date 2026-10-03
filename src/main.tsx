import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import AppRuntime from '@/AppRuntime'
import { readSsrDataFromDocument } from '@/lib/ssr-payload'
import { splitLocalePath } from '@/lib/locale-routes'
import App from './App.tsx'

const root = document.getElementById('root')!
const ssrData = readSsrDataFromDocument() ?? {
  pathname: window.location.pathname,
  locale: splitLocalePath(window.location.pathname).locale,
  routeData: { kind: 'none' as const },
}
const application = (
  <StrictMode>
    <BrowserRouter>
      <AppRuntime ssrData={ssrData}>
        <App />
      </AppRuntime>
    </BrowserRouter>
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, application)
} else {
  createRoot(root).render(application)
}

if (import.meta.env.PROD) {
  void import("@/lib/report-web-vitals").then(({ reportWebVitals }) => reportWebVitals());
}
