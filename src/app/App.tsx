import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from './router'
import { SearchProvider } from '@/components/ui/SearchDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
})

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SearchProvider>{children}</SearchProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export function AppShell() {
  return (
    <AppProviders>
      <RouterProvider />
    </AppProviders>
  )
}

export default AppShell
