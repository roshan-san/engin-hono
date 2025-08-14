import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";
import { useCreateStartup } from "../context/useCreateStartup";

export const StartupContactStep = () => {
  const {
    startupData,
    handleChange,
    nextStep,
    previousStep,
  } = useCreateStartup();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      nextStep();
    }
  };

  return (
    <div className="w-full flex justify-center items-center gap-6 flex-col h-full p-4">
      <div className="flex flex-col gap-6 w-full">
        <h3 className="text-xl font-semibold text-foreground tracking-wide uppercase flex items-center gap-3">
          <Globe className="text-primary w-5 h-5" />
          Website Information
        </h3>
        <Input
          name="website"
          placeholder="Website URL (optional)"
          value={startupData.website || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-14 text-lg rounded-xl"
          autoFocus
        />
      </div>
      
      <div className="w-full p-4 flex justify-between gap-4 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={previousStep}
          className="flex-1 h-12 text-lg font-medium"
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 h-12 text-lg font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}; 