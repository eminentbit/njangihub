import React from "react";
import { useFormContext } from "../../context/njangi.form.context";
import Stepper from "../njangi.form.ui/stepper";
import Step1AccountInfo from "./step1AccountInfo";
import Step2GroupDetails from "./step2GroupDetails";
import Step3InviteMembers from "./step3InviteMember";
import Step4Review from "./step4Review";

const FormStepper: React.FC = () => {
  const { state, goToStep } = useFormContext();
  const { currentStep, isSubmitting, isSubmitted } = state;

  const steps = [
    "Account Setup",
    "Group Details",
    "Invite Members",
    "Review & Submit",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1AccountInfo />;
      case 2:
        return <Step2GroupDetails />;
      case 3:
        return <Step3InviteMembers />;
      case 4:
        return <Step4Review />;
      default:
        return <Step1AccountInfo />;
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      goToStep(step);
    }
  };

  return (
    <div className="w-full">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        disabled={isSubmitting}
        submitted={isSubmitted}
      />

      <div className="mt-8">{renderStep()}</div>
    </div>
  );
};

export default FormStepper;
