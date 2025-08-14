import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/vote-arena")({
  component: VoteArenaPage,
});

function VoteArenaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Vote Arena</h1>
        <p className="text-lg text-muted-foreground">Coming Soon 🚧</p>
      </div>
    </div>
  );
} 