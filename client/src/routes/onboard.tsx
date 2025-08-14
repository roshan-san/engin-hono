import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboard")({
  component: OnboardingLayout,
});

function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Outlet />
    </div>
  );
} 