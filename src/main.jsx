import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Privacy, Terms, CodeOfConduct } from './Legal.jsx';
import './styles.css';

// Tiny path-based router — these are leaf pages with no inter-routing,
// so we just inspect window.location.pathname at mount. Vercel's SPA
// rewrite (vercel.json) sends all paths to index.html, so direct loads
// of /privacy etc. work.
function Root() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  if (p === '/privacy') return <Privacy />;
  if (p === '/terms') return <Terms />;
  if (p === '/code-of-conduct') return <CodeOfConduct />;
  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
