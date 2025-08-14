import { Progress } from "@/components/ui/progress";
import { useCreateStartup } from "./context/useCreateStartup";
import { CreateStartupProvider } from "./context/CreateStartupContext";
import { StartupNameStep } from "./steps/StartupNameStep";
import { StartupLocationStep } from "./steps/StartupLocationStep";
import { StartupDescriptionStep } from "./steps/StartupDescriptionStep";
import { StartupTagsStep } from "./steps/StartupTagsStep";
import { StartupProblemStep } from "./steps/StartupProblemStep";
import { StartupSolutionStep } from "./steps/StartupSolutionStep";
import { StartupTeamStep } from "./steps/StartupTeamStep";
import { StartupFundingStep } from "./steps/StartupFundingStep";
import { StartupContactStep } from "./steps/StartupContactStep";
import { StartupEmailStep } from "./steps/StartupEmailStep";

const CreateStartupForm = () => {
  const { step } = useCreateStartup();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StartupNameStep />;
      case 2:
        return <StartupLocationStep />;
      case 3:
        return <StartupDescriptionStep />;
      case 4:
        return <StartupTagsStep />;
      case 5:
        return <StartupProblemStep />;
      case 6:
        return <StartupSolutionStep />;
      case 7:
        return <StartupTeamStep />;
      case 8:
        return <StartupFundingStep />;
      case 9:
        return <StartupContactStep />;
      case 10:
        return <StartupEmailStep />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="h-full">
      <Progress hidden={step >= 10} value={(step / 10) * 100} className="mb-4" />
      {renderStep()}
    </div>
  );
};

export default function CreateStartup() {
  return (
    <CreateStartupProvider>
      <CreateStartupForm />
    </CreateStartupProvider>
  );
} 