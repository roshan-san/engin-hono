import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
      color: "bg-blue-500"
    },
    { 
      id: "Mentor", 
      title: "Mentor", 
      icon: FaUserGraduate, 
      description: "Guide and support others",
      color: "bg-green-500"
    },
    { 
      id: "Investor", 
      title: "Investor", 
      icon: FaUserTie, 
      description: "Support promising projects",
      color: "bg-orange-500"
    },
  ];

  const handleNext = () => {
    if (userType) {
      localStorage.setItem("onboarding_user_type", userType);
      navigate({ to: "/onboard/username" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Engin
          </h1>
          <p className="text-muted-foreground text-sm">
            What's your primary role in the ecosystem?
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
            <div className="w-2 h-2 bg-muted rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground text-center">Step 1 of 7</p>
        </div>

        {/* Role Selection */}
        <RadioGroup value={userType} onValueChange={setUserType} className="space-y-3 mb-8">
          {roles.map((type) => {
            const Icon = type.icon;
            return (
              <Card 
                key={type.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  userType === type.id
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                onClick={() => setUserType(type.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg text-white ${type.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={type.id} className="text-sm font-medium cursor-pointer">
                          {type.title}
                        </Label>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>

        {/* Navigation */}
        <Button 
          onClick={handleNext} 
          disabled={!userType} 
          className="w-full h-11"
        >
          Continue
          <FaArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 