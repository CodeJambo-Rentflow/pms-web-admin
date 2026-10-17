import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { pmsTheme } from './theme';
import { initKeycloak } from './auth/keycloak';
import 'antd/dist/reset.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

async function bootstrap() {
  await initKeycloak();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={pmsTheme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

bootstrap();
