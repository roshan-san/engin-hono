import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, CheckCircle, XCircle } from "lucide-react";

interface ApplyToPositionProps {
  positionId: Id<"positions">;
  applicantId: Id<"profiles">;
  onSuccess: () => void;
}

export const ApplyToPosition: React.FC<ApplyToPositionProps> = ({ positionId, applicantId, onSuccess }) => {
  const applyToPosition = useMutation(api.startups.mutations.applyToPosition);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Check if user has already applied to this position
  const existingApplication = useQuery(api.startups.queries.getApplicationByUser, {
    positionId,
    applicantId,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await applyToPosition({ positionId, applicantId, message });
      setMessage("");
      onSuccess();
      setOpen(false);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  // If user has already applied, show status
  if (existingApplication) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-muted/50">
        <Badge 
          variant="outline" 
          className={`px-3 py-1 text-sm font-medium flex items-center gap-2 ${getStatusColor(existingApplication.status)}`}
        >
          {getStatusIcon(existingApplication.status)}
          {existingApplication.status === "accepted" ? "Application Accepted" :
           existingApplication.status === "rejected" ? "Application Rejected" : "Application Submitted"}
        </Badge>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Send className="h-4 w-4" />
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Apply to Position</DialogTitle>
          <DialogDescription>
            Introduce yourself and explain why you're interested in this role
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Message (Optional)</label>
            <Textarea
              placeholder="Tell us about your interest in this position, relevant experience, or any questions you might have..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              A brief message can help your application stand out
            </p>
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
              <p className="text-sm text-red-700 dark:text-red-400 break-words">{error}</p>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 