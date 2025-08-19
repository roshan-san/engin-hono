import { ChatWindow } from '@/features/platform/message-users/ChatWindow';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/message/$username')({
  component: RouteComponent,
})

function RouteComponent() {
  const { username } = Route.useParams();
  
  return (
    <ChatWindow username={username} />
  );
}