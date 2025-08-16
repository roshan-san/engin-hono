import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaCheck } from "react-icons/fa";

export const Route = createFileRoute("/onboard/location")({
  component: LocationPage,
});

function LocationPage() {
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const workType = localStorage.getItem("onboarding_work_type");
    if (!workType) {
      navigate({ to: "/onboard/work-type" });
    }
  }, [navigate]);

  const validateLocation = (value: string) => {
    if (value.trim().length === 0) {
      setError("Location is required");
      setIsValid(false);
      return;
    }
    if (value.trim().length < 2) {
      setError("Location must be at least 2 characters");
      setIsValid(false);
      return;
    }
    setError("");
    setIsValid(true);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    validateLocation(value);
  };

  const handleNext = () => {
    if (isValid) {
      localStorage.setItem("onboarding_location", location.trim());
      navigate({ to: "/onboard/skills" });
    }
  };

  const handleBack = () => {
    navigate({ to: "/onboard/work-type" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-5 bg-primary/10 rounded-full">
                <FaMapMarkerAlt className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
              Where are you located?
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto px-4">
              This helps others find you for local opportunities
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center">Step 4 of 7</p>
          </div>

          {/* Location Input */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative">
              <Input
                placeholder="Enter your location (e.g., San Francisco, CA)"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className={`h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                  isValid ? "border-green-500 bg-green-50" : 
                  error ? "border-red-500 bg-red-50" : "border-border"
                }`}
                autoFocus
              />
              {isValid && (
                <div className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2">
                  <FaCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500" />
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 sm:p-4 lg:p-6 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
                <p className="text-red-600 text-sm sm:text-base lg:text-lg">{error}</p>
              </div>
            )}

            {isValid && (
              <div className="p-3 sm:p-4 lg:p-6 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl">
                <p className="text-green-600 text-sm sm:text-base lg:text-lg">✓ Location looks good</p>
              </div>
            )}

            <div className="text-xs sm:text-sm lg:text-base text-muted-foreground space-y-1 sm:space-y-2 px-2">
              <p>• Include city and state/country for better matching</p>
              <p>• This helps with local networking and opportunities</p>
              <p>• You can update this later in your profile</p>
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
              disabled={!isValid} 
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