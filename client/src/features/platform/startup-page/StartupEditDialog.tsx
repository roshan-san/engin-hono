import React, { useState } from "react";
import { Save, Edit, X, CheckCircle, AlertCircle, Settings, Building2, MapPin, Users, DollarSign, Globe, Mail, Tag, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StartupEditDialogProps {
  startup: Doc<"startups">;
  iconOnly?: boolean;
  renderTrigger?: (props: { open: boolean; setOpen: (open: boolean) => void }) => React.ReactNode;
}

export function StartupEditDialog({ startup, iconOnly = false, renderTrigger }: StartupEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {renderTrigger
          ? renderTrigger({ open, setOpen })
          : (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:bg-primary/10 hover:text-primary border-primary/20"
              aria-label="Edit Startup"
            >
              <Edit className="h-4 w-4" />
              {!iconOnly && <span className="text-sm font-medium">Edit</span>}
            </Button>
          )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b border-border/50 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-primary" />
              Edit Startup
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <StartupForm startup={startup} setOpen={setOpen} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StartupForm({ startup, setOpen }: { startup: Doc<"startups">, setOpen: (open: boolean) => void }) {
  const updateStartup = useMutation(api.startups.mutations.updateStartup);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'error' | 'success', message: string} | null>(null);
  const [formData, setFormData] = useState({
    name: startup.name || "",
    description: startup.description || "",
    problem: startup.problem || "",
    solution: startup.solution || "",
    location: startup.location || "",
    funding: startup.funding || 0,
    team_size: startup.team_size || 1,
    stage: startup.stage || "Growth",
    website: startup.website || "",
    email: startup.email || "",
    tags: startup.tags ? startup.tags.join(', ') : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Startup name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.problem.trim()) {
      newErrors.problem = "Problem statement is required";
    }
    if (!formData.solution.trim()) {
      newErrors.solution = "Solution description is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.funding < 0) {
      newErrors.funding = "Funding cannot be negative";
    }
    if (formData.team_size < 1) {
      newErrors.team_size = "Team size must be at least 1";
    }
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = "Website must start with http:// or https://";
    }
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFeedback(null);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFeedback(null);
    
    try {
      await updateStartup({
        startupId: startup._id,
        ...formData,
        stage: formData.stage || "Growth",
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      });
      
      setFeedback({ type: 'success', message: 'Startup updated successfully!' });
      setTimeout(() => setOpen(false), 1500);
    } catch (error: unknown) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update startup' });
    } finally {
      setLoading(false);
    }
  };

  const stageOptions = [
    "Idea", "MVP", "Early Stage", "Growth", "Scale", "Mature"
  ];

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Tabs defaultValue="basic" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mb-6 flex-shrink-0">
          <TabsTrigger value="basic" className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4" />
            <span>Basic</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4" />
            <span>Details</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto space-y-6 pb-4">
          <TabsContent value="basic" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Core details about your startup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Startup Name *
                  </Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => handleInputChange("name", e.target.value)} 
                    className={`mt-1 h-11 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your startup name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={e => handleInputChange("description", e.target.value)} 
                    className={`mt-1 min-h-[80px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe what your startup does..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location *
                    </Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="location" 
                        value={formData.location} 
                        onChange={e => handleInputChange("location", e.target.value)} 
                        className={`pl-10 h-11 ${errors.location ? 'border-red-500' : ''}`}
                        placeholder="City, Country"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stage" className="text-sm font-medium">
                      Stage
                    </Label>
                    <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                      <SelectTrigger className="mt-1 h-11">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stageOptions.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {/* Problem & Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Problem & Solution
                </CardTitle>
                <CardDescription>
                  Define the problem you're solving and your solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="problem" className="text-sm font-medium">
                    Problem Statement *
                  </Label>
                  <Textarea 
                    id="problem" 
                    value={formData.problem} 
                    onChange={e => handleInputChange("problem", e.target.value)} 
                    className={`mt-1 min-h-[80px] resize-none ${errors.problem ? 'border-red-500' : ''}`}
                    placeholder="What problem are you solving?"
                  />
                  {errors.problem && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.problem}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="solution" className="text-sm font-medium">
                    Solution *
                  </Label>
                  <Textarea 
                    id="solution" 
                    value={formData.solution} 
                    onChange={e => handleInputChange("solution", e.target.value)} 
                    className={`mt-1 min-h-[80px] resize-none ${errors.solution ? 'border-red-500' : ''}`}
                    placeholder="How are you solving this problem?"
                  />
                  {errors.solution && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.solution}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team & Funding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Team & Funding
                </CardTitle>
                <CardDescription>
                  Information about your team and funding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team_size" className="text-sm font-medium">
                      Team Size *
                    </Label>
                    <div className="relative mt-1">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="team_size" 
                        type="number" 
                        value={formData.team_size} 
                        onChange={e => handleInputChange("team_size", Number(e.target.value))} 
                        className={`pl-10 h-11 ${errors.team_size ? 'border-red-500' : ''}`}
                        placeholder="Number of members"
                        min={1}
                      />
                    </div>
                    {errors.team_size && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.team_size}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="funding" className="text-sm font-medium">
                      Funding ($)
                    </Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="funding" 
                        type="number" 
                        value={formData.funding} 
                        onChange={e => handleInputChange("funding", Number(e.target.value))} 
                        className={`pl-10 h-11 ${errors.funding ? 'border-red-500' : ''}`}
                        placeholder="Amount raised"
                        min={0}
                      />
                    </div>
                    {errors.funding && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.funding}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags & Features
                  </Label>
                  <div className="relative mt-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="tags" 
                      value={formData.tags} 
                      onChange={e => handleInputChange("tags", e.target.value)} 
                      className="pl-10 h-11"
                      placeholder="AI-powered, Real-time, Cloud-based... (comma separated)"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add relevant tags to help others discover your startup
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  How people can reach you and learn more
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="website" 
                      value={formData.website} 
                      onChange={e => handleInputChange("website", e.target.value)} 
                      className={`pl-10 h-11 ${errors.website ? 'border-red-500' : ''}`}
                      placeholder="https://yourstartup.com"
                    />
                  </div>
                  {errors.website && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.website}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Contact Email
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={e => handleInputChange("email", e.target.value)} 
                      className={`pl-10 h-11 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="contact@yourstartup.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Feedback and Submit */}
      <div className="mt-6 space-y-4 pt-4 border-t border-border/50 flex-shrink-0">
        {feedback && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            feedback.type === 'error' 
              ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            type="submit" 
            disabled={loading || feedback?.type === 'success'} 
            className="flex-1 gap-2 h-11 font-medium"
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
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="h-11 px-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}