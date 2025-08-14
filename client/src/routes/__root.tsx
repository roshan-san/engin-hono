import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.js'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackQueryLayout />
    </>
  ),
})
