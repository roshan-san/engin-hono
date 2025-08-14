import React, { useState } from "react";
import { Save, ArrowLeft, CheckCircle, AlertCircle, Settings, Building2, MapPin, Users, DollarSign, Globe, Mail, Tag, Target, Lightbulb } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";
import { Link, useNavigate } from "@tanstack/react-router";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface StartupEditPageProps {
  startup: Doc<"startups">;
}

export function StartupEditPage({ startup }: StartupEditPageProps) {
  const navigate = useNavigate();
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
    
    setLoading(true);
    setFeedback(null);
    
    try {
      await updateStartup({
        startupId: startup._id,
        name: formData.name,
        description: formData.description,
        problem: formData.problem,
        solution: formData.solution,
        location: formData.location,
        funding: formData.funding,
        team_size: formData.team_size,
        stage: formData.stage || "Growth",
        website: formData.website,
        email: formData.email,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      });
      
      setFeedback({ type: 'success', message: 'Startup updated successfully!' });
      setTimeout(() => {
        navigate({ to: `/startups/${startup._id}` });
      }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section - Fixed at top */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/startups/$startupid"
              params={{ startupid: startup._id }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/80 hover:bg-muted transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                <Settings className="h-6 w-6 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  Edit Startup: {startup.name}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1 line-clamp-2 sm:line-clamp-1">
                  Update your startup information
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - With proper spacing to avoid header overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="w-full">
          {/* Main Content */}
          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 lg:h-14 bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm sticky top-0 z-10">
                  <TabsTrigger 
                    value="basic" 
                    className="flex items-center gap-2 text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
                  >
                    <Building2 className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Basic</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details" 
                    className="flex items-center gap-2 text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
                  >
                    <Target className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Details</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contact" 
                    className="flex items-center gap-2 text-sm lg:text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
                  >
                    <Globe className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden sm:inline">Contact</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 lg:mt-8">
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
                            className="mt-1 h-11"
                            placeholder="Enter your startup name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">
                            Description *
                          </Label>
                          <Textarea 
                            id="description" 
                            value={formData.description} 
                            onChange={e => handleInputChange("description", e.target.value)} 
                            className="mt-1 min-h-[80px] resize-none"
                            placeholder="Describe what your startup does..."
                          />
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
                                className="pl-10 h-11"
                                placeholder="City, Country"
                              />
                            </div>
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
                            className="mt-1 min-h-[80px] resize-none"
                            placeholder="What problem are you solving?"
                          />
                        </div>

                        <div>
                          <Label htmlFor="solution" className="text-sm font-medium">
                            Solution *
                          </Label>
                          <Textarea 
                            id="solution" 
                            value={formData.solution} 
                            onChange={e => handleInputChange("solution", e.target.value)} 
                            className="mt-1 min-h-[80px] resize-none"
                            placeholder="How are you solving this problem?"
                          />
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
                                className="pl-10 h-11"
                                placeholder="Number of members"
                                min={1}
                              />
                            </div>
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
                                className="pl-10 h-11"
                                placeholder="Amount raised"
                                min={0}
                              />
                            </div>
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
                              className="pl-10 h-11"
                              placeholder="https://yourstartup.com"
                            />
                          </div>
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
                              className="pl-10 h-11"
                              placeholder="contact@yourstartup.com"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Feedback and Submit */}
              <div className="space-y-4 pt-6 border-t border-border/50 mt-8">
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
                  
                  <Link to="/startups/$startupid" params={{ startupid: startup._id }}>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-11 px-4"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 