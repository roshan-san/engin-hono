import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import type { Doc } from "@/../convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";

interface ProfileEditPopoverProps {
  profile: Doc<"profiles">;
}

export function ProfileEditPopover({ profile }: ProfileEditPopoverProps) {
  const updateProfile = useMutation(api.profile.mutations.updateProfile);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'error' | 'success', message: string} | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: profile.name || "",
    username: profile.username || "",
    location: profile.location || "",
    work_type: profile.work_type || "",
    bio: profile.bio || "",
    github_url: profile.github_url || "",
    linkedin_url: profile.linkedin_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    
    try {
      await updateProfile({
        profileId: profile._id,
        ...formData,
      });
      
      setFeedback({ type: 'success', message: 'Profile updated!' });
      setTimeout(() => {
        setOpen(false);
      }, 1500);
    } catch (error: unknown) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFeedback(null);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFeedback(null);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-4 font-medium gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-4" align="end">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Edit Profile</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your full name"
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="username"
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work_type" className="text-sm font-medium">Work Type</Label>
              <Input
                id="work_type"
                value={formData.work_type}
                onChange={(e) => handleInputChange("work_type", e.target.value)}
                placeholder="Full-time, Remote, etc."
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[80px] resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-sm font-medium">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => handleInputChange("github_url", e.target.value)}
                placeholder="https://github.com/username"
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="text-sm font-medium">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-9"
              />
            </div>
          </div>

          {feedback && (
            <div className={`text-sm p-3 rounded-lg ${feedback.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'}`}>
              {feedback.message}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={loading || (feedback?.type === 'success')}
              className="flex-1 gap-2 h-9"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
} 