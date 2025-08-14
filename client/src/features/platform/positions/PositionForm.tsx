import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PositionFormProps {
  startupId: Id<"startups">;
  onSuccess: () => void;
}

export function PositionForm({ startupId, onSuccess }: PositionFormProps) {
  const createPosition = useMutation(api.startups.mutations.createPosition);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);
    try {
      await createPosition({ startupId, title, description, requirements });
      setTitle(""); 
      setDescription(""); 
      setRequirements("");
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Position Title *</label>
        <Input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g., Senior Frontend Developer, Product Manager, etc."
          required 
          className="h-11"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Job Description *</label>
        <Textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Describe the role, responsibilities, and what makes this position exciting..."
          required 
          className="min-h-[120px] resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Requirements (Optional)</label>
        <Input 
          value={requirements} 
          onChange={e => setRequirements(e.target.value)} 
          placeholder="e.g., 3+ years experience, React knowledge, remote-friendly"
        />
        <p className="text-xs text-muted-foreground">
          List key skills, experience, or qualifications needed for this role
        </p>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={loading || !title.trim() || !description.trim()} 
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create Position
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 