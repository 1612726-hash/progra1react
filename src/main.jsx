import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// PrimeReact Core & Icons & Flex CSS
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Global application styles
import './styles/global.css';
import './styles/retroTheme.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
