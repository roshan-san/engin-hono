import { useContext } from "react";
import { CreateStartupContext } from "./CreateStartupContext";

export const useCreateStartup = () => {
  const context = useContext(CreateStartupContext);
  if (context === undefined) {
    throw new Error(
      "useCreateStartup must be used within a CreateStartupProvider"
    );
  }
  return context;
}; 