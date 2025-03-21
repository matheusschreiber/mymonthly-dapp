import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from "wagmi";
import { config } from "./lib/wagmi";
import MyRoutes from "./routes";
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>

        <MyRoutes />

      </QueryClientProvider>
    </WagmiProvider>

  </ThemeProvider>
)
