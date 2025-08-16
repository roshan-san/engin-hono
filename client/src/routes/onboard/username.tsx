import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowLeft, FaArrowRight, FaUser, FaCheck, FaSpinner } from "react-icons/fa";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

export const Route = createFileRoute("/onboard/username")({
  component: UsernamePage,
});

function UsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  const validateUsername = useMutation(api.profile.mutations.validateUsername);

  useEffect(() => {
    const userType = localStorage.getItem("onboarding_user_type");
    if (!userType) {
      navigate({ to: "/onboard/user-type" });
    }
  }, [navigate]);

  // Debounced backend validation
  const debouncedBackendCheck = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        if (value.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(value)) {
          timeoutId = setTimeout(async () => {
            setIsChecking(true);
            try {
              const result = await validateUsername({ username: value });
              setBackendAvailable(result.available);
              if (!result.available) {
                setError(result.message);
                setIsValid(false);
              } else {
                setError("");
                setIsValid(true);
              }
            } catch (err) {
              setError("Failed to check username availability");
              setIsValid(false);
            } finally {
              setIsChecking(false);
            }
          }, 500); // 500ms debounce
        } else {
          setBackendAvailable(null);
        }
      };
    })(),
    [validateUsername]
  );

  const validateUsernameLocal = (value: string) => {
    if (value.length < 3) {
      setError("Username must be at least 3 characters");
      setIsValid(false);
      return;
    }
    if (value.length > 20) {
      setError("Username must be less than 20 characters");
      setIsValid(false);
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setError("Username can only contain letters, numbers, hyphens, and underscores");
      setIsValid(false);
      return;
    }
    // If local validation passes, trigger backend check
    debouncedBackendCheck(value);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsernameLocal(value);
  };

  const handleNext = () => {
    if (isValid && backendAvailable) {
      localStorage.setItem("onboarding_username", username);
      navigate({ to: "/onboard/work-type" });
    }
  };

  const handleBack = () => {
    navigate({ to: "/onboard/user-type" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-5 bg-primary/10 rounded-full">
                <FaUser className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
              Choose Your Username
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto px-4">
              This will be your unique identifier on the platform
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center">Step 2 of 7</p>
          </div>

          {/* Username Input */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="relative">
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className={`h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${
                  isValid && backendAvailable ? "border-green-500 bg-green-50" : 
                  error ? "border-red-500 bg-red-50" : "border-border"
                }`}
                autoFocus
                disabled={isChecking}
              />
              {isChecking && (
                <div className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2">
                  <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500 animate-spin" />
                </div>
              )}
              {isValid && backendAvailable && !isChecking && (
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

            {isValid && backendAvailable && !isChecking && (
              <div className="p-3 sm:p-4 lg:p-6 bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl">
                <p className="text-green-600 text-sm sm:text-base lg:text-lg">✓ Username is available</p>
              </div>
            )}

            {isChecking && (
              <div className="p-3 sm:p-4 lg:p-6 bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl">
                <p className="text-blue-600 text-sm sm:text-base lg:text-lg flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Checking availability...
                </p>
              </div>
            )}

            <div className="text-xs sm:text-sm lg:text-base text-muted-foreground space-y-1 sm:space-y-2 px-2">
              <p>• Username must be 3-20 characters long</p>
              <p>• Can contain letters, numbers, hyphens, and underscores</p>
              <p>• This will be your unique profile URL</p>
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
              disabled={!isValid || !backendAvailable || isChecking} 
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