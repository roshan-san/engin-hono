import { BottomBar } from "@/features/platform/navigation-bars/BottomBar";
import { TopBar } from "@/features/platform/navigation-bars/TopBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
      <div className="flex min-h-screen flex-col w-full">
        <div className="sticky top-0 z-50">
          <TopBar />
        </div>
        <main className="flex-1 w-full overflow-y-auto pb-20 md:pb-6">
          <Outlet />
        </main>
        <div className="block md:hidden fixed bottom-0 left-0 w-full z-50 bg-background border-t">
          <BottomBar />
        </div>
      </div>
  );
}
