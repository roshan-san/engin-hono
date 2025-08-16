import { createFileRoute } from '@tanstack/react-router'
import { MessagesLayout } from '@/features/platform/message-users'

export const Route = createFileRoute('/_protected/message/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MessagesLayout />
}
