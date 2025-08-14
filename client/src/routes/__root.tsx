import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.js'

import type { QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/ThemeProvider.js'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark">
        <Outlet />
        <TanStackQueryLayout />
      </ThemeProvider>
    </>
  ),
})
