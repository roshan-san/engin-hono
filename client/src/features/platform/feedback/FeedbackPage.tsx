import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, AlertCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";

export function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<"feature-request" | "bug-report" | "improvement" | "general" | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = useMutation(api.feedback.mutations.submit);
  const navigate = useNavigate();

  const handleFeedbackTypeChange = (value: string) => {
    setFeedbackType(value as "feature-request" | "bug-report" | "improvement" | "general" | "");
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as "low" | "medium" | "high" | "critical" | "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType || !title || !description) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        type: feedbackType,
        title,
        description,
        priority: priority || "medium",
      });
      // Navigate to home page after successful submission
      navigate({ to: "/home" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Help Shape Engin</h1>
            <p className="text-muted-foreground">We're still in development and your feedback is crucial!</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            🚀 Early Access
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Community Driven
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Your Voice Matters
          </Badge>
        </div>

        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Engin is in Active Development</h3>
                <p className="text-sm text-orange-700">
                  We're building the future of startup collaboration. Your feedback helps us prioritize features and fix issues. 
                  Tell us what you need most!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Feedback</CardTitle>
          <CardDescription>
            Help us build the features you need most. Be specific about what you'd like to see!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedbackType">Feedback Type *</Label>
              <Select value={feedbackType} onValueChange={handleFeedbackTypeChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="What type of feedback is this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature-request">🚀 Feature Request</SelectItem>
                  <SelectItem value="bug-report">🐛 Bug Report</SelectItem>
                  <SelectItem value="improvement">💡 Improvement Suggestion</SelectItem>
                  <SelectItem value="general">💬 General Feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your feedback"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about your feedback. For feature requests, explain how it would help you. For bugs, describe what happened and what you expected."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="How important is this to you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Nice to have</SelectItem>
                  <SelectItem value="medium">Medium - Would be helpful</SelectItem>
                  <SelectItem value="high">High - Important for my workflow</SelectItem>
                  <SelectItem value="critical">Critical - Blocking my progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !feedbackType || !title || !description}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold">Review & Prioritize</h4>
                <p className="text-sm text-muted-foreground">
                  We review all feedback and prioritize based on community needs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold">Development</h4>
                <p className="text-sm text-muted-foreground">
                  High-priority features get implemented in upcoming releases
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold">Notification</h4>
                <p className="text-sm text-muted-foreground">
                  You'll be notified when your requested features are live
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                4
              </div>
              <div>
                <h4 className="font-semibold">Community Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Regular updates on what we're building based on your feedback
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 