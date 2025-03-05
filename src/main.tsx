import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental";

import ErrorBoundary from "./ErrorBoundary";
import AppRouter from "./AppRouter";
import "./index.css";
import 'react-tooltip/dist/react-tooltip.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 60 * 1000,
    },
  },
});

const localStoragePersistor = createWebStoragePersistor({ storage: window.localStorage });

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);