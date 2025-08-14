import React, { createContext, useState, type ReactNode } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";

interface StartupData {
  name: string;
  description: string;
  problem: string;
  solution: string;
  location: string;
  funding: string;
  team_size: string;
  stage?: string;
  website?: string;
  email?: string;
  tags?: string;
}

interface CreateStartupContextType {
  step: number;
  startupData: StartupData;
  isCreating: boolean;
  nextStep: () => void;
  previousStep: () => void;
  handleCreate: () => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const CreateStartupContext = createContext<
  CreateStartupContextType | undefined
>(undefined);

export { CreateStartupContext };

export const CreateStartupProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [step, setStep] = useState(1);
  const [startupData, setStartupData] = useState<StartupData>({
    name: "",
    description: "",
    problem: "",
    solution: "",
    location: "",
    funding: "",
    team_size: "",
    stage: "Growth",
    website: "",
    email: "",
    tags: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const createStartup = useMutation(api.startups.mutations.createStartup);

  const nextStep = () => setStep((prev) => Math.min(10, prev + 1));
  const previousStep = () => setStep((prev) => Math.max(1, prev - 1));
  const navigate= useNavigate()

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const numericData = {
        ...startupData,
        funding: Number(startupData.funding) || 0,
        team_size: 1, // Always start with 1 (the founder)
        stage: startupData.stage || "Growth",
        tags: startupData.tags ? startupData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
      };
      const startup= await createStartup(numericData);
      navigate({to:"/startups/$startupid", params:{startupid: startup}});
      setStep(9)
    } catch (error) {
      console.error("Failed to create startup", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStartupData((prev) => ({ ...prev, [name]: value }));
  };

  const value = {
    step,
    startupData,
    isCreating,
    nextStep,
    previousStep,
    handleCreate,
    handleChange,
  };

  return (
    <CreateStartupContext.Provider value={value}>
      {children}
    </CreateStartupContext.Provider>
  );
}; 