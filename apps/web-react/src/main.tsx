import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.js';
import './i18n.js';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      forceColorScheme="dark"
    >
      <Notifications zIndex={9999999999999} />
      <App />
    </MantineProvider>
  </StrictMode>,
)
