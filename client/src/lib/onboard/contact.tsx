import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowLeft, FaGithub, FaLinkedinIn, FaSpinner, FaCheck } from "react-icons/fa";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

export const Route = createFileRoute("/onboard/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const createProfile = useMutation(api.profile.mutations.createProfile);

  useEffect(() => {
    const interests = localStorage.getItem("onboarding_interests");
    if (!interests) {
      navigate({ to: "/onboard/interests" });
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    setError("");
    
    try {
      const userType = localStorage.getItem("onboarding_user_type");
      const username = localStorage.getItem("onboarding_username");
      const workType = localStorage.getItem("onboarding_work_type");
      const location = localStorage.getItem("onboarding_location");
      const skills = JSON.parse(localStorage.getItem("onboarding_skills") || "[]");
      const interests = JSON.parse(localStorage.getItem("onboarding_interests") || "[]");

      if (!userType || !username || !workType || !location) {
        throw new Error("Missing required information. Please go back and complete all steps.");
      }

      await createProfile({
        username,
        user_type: userType,
        work_type: workType,
        location,
        skills,
        interests,
        github_url: githubUrl || undefined,
        linkedin_url: linkedinUrl || undefined,
      });
      
      localStorage.removeItem("onboarding_user_type");
      localStorage.removeItem("onboarding_username");
      localStorage.removeItem("onboarding_work_type");
      localStorage.removeItem("onboarding_location");
      localStorage.removeItem("onboarding_skills");
      localStorage.removeItem("onboarding_interests");
      
      navigate({ to: "/home" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create profile";
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    navigate({ to: "/onboard/interests" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-5 bg-primary/10 rounded-full">
                <FaGithub className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
              Add Social Links
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto px-4">
              Connect your profiles to help others find you
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center">Step 7 of 7</p>
          </div>

          {/* Social Links */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {error && (
              <div className="p-3 sm:p-4 lg:p-6 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
                <p className="text-red-600 text-sm sm:text-base lg:text-lg">{error}</p>
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <FaGithub className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-foreground/80 flex-shrink-0" />
                <Input
                  placeholder="GitHub URL (optional)"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl"
                  disabled={isCreating}
                />
              </div>
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <FaLinkedinIn className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-foreground/80 flex-shrink-0" />
                <Input
                  placeholder="LinkedIn URL (optional)"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div className="text-xs sm:text-sm lg:text-base text-muted-foreground space-y-1 sm:space-y-2 px-2">
              <p>• These links help others connect with you professionally</p>
              <p>• Both fields are optional</p>
              <p>• You can always update these later in your profile</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 sm:mt-12 lg:mt-16 flex gap-3 sm:gap-4 lg:gap-6">
            <Button 
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex-1 h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold rounded-xl"
              disabled={isCreating}
            >
              <FaArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              size="lg"
              className="flex-1 h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin mr-2" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 