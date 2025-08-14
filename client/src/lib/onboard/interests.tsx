import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowLeft, FaArrowRight, FaHeart, FaPlus, FaTimes } from "react-icons/fa";

export const Route = createFileRoute("/onboard/interests")({
  component: InterestsPage,
});

function InterestsPage() {
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const skills = localStorage.getItem("onboarding_skills");
    if (!skills) {
      navigate({ to: "/onboard/skills" });
    }
  }, [navigate]);

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed) && interests.length < 8) {
      setInterests([...interests, trimmed]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    localStorage.setItem("onboarding_interests", JSON.stringify(interests));
    navigate({ to: "/onboard/contact" });
  };

  const handleBack = () => {
    navigate({ to: "/onboard/skills" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newInterest.trim()) {
        addInterest();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-5 bg-primary/10 rounded-full">
                <FaHeart className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
              Add Your Interests
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              What topics and areas are you passionate about?
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
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center">Step 6 of 7</p>
          </div>

          {/* Interests Input */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6">
              <Input
                placeholder="Add an interest (e.g., AI, Sustainability, Gaming)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl flex-1"
                autoFocus
                disabled={interests.length >= 8}
              />
              <Button 
                onClick={addInterest} 
                className="h-12 sm:h-14 lg:h-16 w-12 sm:w-14 lg:w-16 rounded-xl sm:rounded-2xl flex-shrink-0" 
                disabled={!newInterest.trim() || interests.length >= 8}
              >
                <FaPlus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </Button>
            </div>
            
            {interests.length >= 8 && (
              <div className="p-3 sm:p-4 lg:p-6 bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl">
                <p className="text-yellow-700 text-sm sm:text-base lg:text-lg">Maximum 8 interests reached</p>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  <p>Added interests ({interests.length}/8):</p>
                </div>
                {interests.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setInterests([])}
                    className="text-muted-foreground hover:text-destructive text-xs sm:text-sm lg:text-base"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
                {interests.length === 0 ? (
                  <div className="w-full p-6 sm:p-8 lg:p-12 text-center border-2 border-dashed border-muted rounded-xl sm:rounded-2xl">
                    <FaHeart className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4 lg:mb-6" />
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">No interests added yet</p>
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground/70">Add some interests to connect with like-minded people!</p>
                  </div>
                ) : (
                  interests.map((interest, index) => (
                    <div 
                      key={index} 
                      className="bg-primary/10 text-primary px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-full flex items-center gap-2 sm:gap-3 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-xs sm:text-sm lg:text-base font-medium">{interest}</span>
                      <button 
                        onClick={() => removeInterest(index)} 
                        className="hover:text-destructive transition-colors p-1 rounded-full hover:bg-primary/20"
                      >
                        <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="text-xs sm:text-sm lg:text-base text-muted-foreground space-y-1 sm:space-y-2 px-2">
              <p>• Add topics you're passionate about (max 8)</p>
              <p>• This helps you connect with like-minded people</p>
              <p>• You can always update your interests later</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 sm:mt-12 lg:mt-16 flex gap-3 sm:gap-4 lg:gap-6">
            <Button 
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex-1 h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold rounded-xl"
            >
              <FaArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              size="lg"
              className="flex-1 h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue
              <FaArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 