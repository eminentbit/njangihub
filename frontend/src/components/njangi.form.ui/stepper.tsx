import React from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  disabled?: boolean;
  submitted?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  disabled = false,
  submitted = false,
}) => {
  if (submitted) {
    return null;
  }

  return (
    <div className="w-full py-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[640px] px-4 md:px-0 md:min-w-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep >= stepNumber;
          const isActive = currentStep === stepNumber;
          const isClickable = !disabled && isCompleted && onStepClick;

          return (
            <React.Fragment key={step}>
              {/* Step indicator */}
              <div className="relative flex flex-col items-center flex-shrink-0">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                    isCompleted ? "bg-blue-600 text-white" : "",
                    isActive
                      ? "bg-blue-100 border-2 border-blue-600 text-blue-600"
                      : "",
                    !isActive && !isCompleted
                      ? "bg-gray-100 border-2 border-gray-300 text-gray-500"
                      : "",
                    isClickable ? "cursor-pointer hover:bg-blue-700" : ""
                  )}
                  onClick={() => {
                    if (isClickable && onStepClick) {
                      onStepClick(stepNumber);
                    }
                  }}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <span className="text-sm font-medium">{stepNumber}</span>
                  )}
                </div>
                <div className="text-xs font-medium text-center mt-2 w-20 sm:w-24 md:w-32">
                  <span
                    className={clsx(
                      "line-clamp-2",
                      isActive ? "text-blue-600" : "",
                      isCompleted ? "text-blue-600" : "",
                      !isActive && !isCompleted ? "text-gray-500" : ""
                    )}
                  >
                    {step}
                  </span>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "flex-grow border-t-2 mx-4 transition-colors duration-300",
                    currentStep > index + 1
                      ? "border-blue-600"
                      : "border-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
