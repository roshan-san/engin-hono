import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaArrowLeft, FaArrowRight, FaBriefcase, FaClock, FaFileContract } from "react-icons/fa";

export const Route = createFileRoute("/onboard/work-type")({
  component: WorkTypePage,
});

function WorkTypePage() {
  const [workType, setWorkType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("onboarding_username");
    if (!username) {
      navigate({ to: "/onboard/username" });
    }
  }, [navigate]);

  const workTypes = [
    { 
      id: "Full-Time", 
      title: "Full Time", 
      icon: FaBriefcase, 
      description: "40+ hours per week",
      color: "from-blue-500 to-indigo-600",
      details: "Dedicated to projects full-time"
    },
    { 
      id: "Part-Time", 
      title: "Part Time", 
      icon: FaClock, 
      description: "20-30 hours per week",
      color: "from-green-500 to-emerald-600",
      details: "Flexible commitment with other priorities"
    },
    { 
      id: "Contract", 
      title: "Contract", 
      icon: FaFileContract, 
      description: "Project-based work",
      color: "from-purple-500 to-pink-600",
      details: "Short-term project collaborations"
    },
  ];

  const handleNext = () => {
    if (workType) {
      localStorage.setItem("onboarding_work_type", workType);
      navigate({ to: "/onboard/location" });
    }
  };

  const handleBack = () => {
    navigate({ to: "/onboard/username" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="p-3 sm:p-4 lg:p-5 bg-primary/10 rounded-full">
                <FaBriefcase className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6">
              Work Type Preference
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              How do you prefer to work on projects?
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 sm:mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-muted rounded-full"></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center">Step 3 of 7</p>
          </div>

          {/* Work Type Selection */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <RadioGroup value={workType} onValueChange={setWorkType} className="grid gap-4 sm:gap-6 lg:gap-8 w-full">
              {workTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.id}
                    className={`group relative flex items-start space-x-3 sm:space-x-4 lg:space-x-6 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl ${
                      workType === type.id
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-2 sm:mt-3 lg:mt-4" />
                    
                    <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 flex-1">
                      <div className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 flex-shrink-0 ${
                        workType === type.id
                          ? `bg-gradient-to-br ${type.color} text-white scale-110 shadow-lg`
                          : "bg-muted/80 group-hover:bg-muted"
                      }`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                        <div className="font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl">{type.title}</div>
                        <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">{type.description}</div>
                        <div className="text-xs sm:text-sm lg:text-base text-muted-foreground/80">{type.details}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
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
              disabled={!workType} 
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