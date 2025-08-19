import { createFileRoute } from "@tanstack/react-router";
import { FeedbackPage } from "@/features/platform/feedback/FeedbackPage";

export const Route = createFileRoute("/_protected/feedback")({
  component: FeedbackPage,
}); 