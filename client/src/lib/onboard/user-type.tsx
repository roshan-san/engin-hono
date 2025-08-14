import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaUserCog, FaUserGraduate, FaUserTie, FaArrowRight } from "react-icons/fa";

export const Route = createFileRoute("/onboard/user-type")({
  component: UserTypePage,
});

function UserTypePage() {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const roles = [
    { 
      id: "Creator/Collaborator", 
      title: "Creator/Collaborator", 
      icon: FaUserCog, 
      description: "Build and collaborate on projects",
      color: "from-blue-500 to-purple-600"
    },
    { 
      id: "Mentor", 
      title: "Mentor", 
      icon: FaUserGraduate, 
      description: "Guide and support others",
      color: "from-green-500 to-teal-600"
    },
    { 
      id: "Investor", 
      title: "Investor", 
      icon: FaUserTie, 
      description: "Support promising projects",
      color: "from-orange-500 to-red-600"
    },
  ];

  const handleNext = () => {
    if (userType) {
      localStorage.setItem("onboarding_user_type", userType);
      navigate({ to: "/onboard/username" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Welcome to Engin
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
              Let's get to know you better. What's your primary role in the ecosystem?
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-primary rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-muted rounded-full"></div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center">Step 1 of 7</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <RadioGroup value={userType} onValueChange={setUserType} className="grid gap-4 sm:gap-6 lg:gap-8 w-full">
              {roles.map((type) => {
                const Icon = type.icon;
                return (
                  <label
                    key={type.id}
                    className={`group relative flex items-start space-x-3 sm:space-x-4 lg:space-x-6 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl ${
                      userType === type.id
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-2 sm:mt-3 lg:mt-4" />
                    
                    <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 flex-1">
                      <div className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 flex-shrink-0 ${
                        userType === type.id
                          ? `bg-gradient-to-br ${type.color} text-white scale-110 shadow-lg`
                          : "bg-muted/80 group-hover:bg-muted"
                      }`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                        <div className="font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl">{type.title}</div>
                        <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="mt-8 sm:mt-12 lg:mt-16 flex justify-center">
            <Button 
              onClick={handleNext} 
              disabled={!userType} 
              size="lg"
              className="h-12 sm:h-14 lg:h-16 px-6 sm:px-8 lg:px-12 text-base sm:text-lg lg:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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