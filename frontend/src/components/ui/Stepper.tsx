import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

export interface StepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const { t } = useTranslation();

  const steps = [
    { number: 1, label: t('ui.step1') },
    { number: 2, label: t('ui.step2') },
    { number: 3, label: t('ui.step3') },
    { number: 4, label: t('ui.step4') },
  ];

  return (
    <nav aria-label="Progress" className="w-full py-4">
      <ol className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {steps.map((step, idx) => {
          const isDone = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <li className="flex flex-col items-center relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    isDone
                      ? 'bg-primary text-white'
                      : isCurrent
                      ? 'bg-primary-container text-white ring-4 ring-primary-container/20'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCurrent ? 'text-primary font-bold' : isDone ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}
                >
                  {step.label}
                </span>
              </li>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-5 transition-colors ${
                    currentStep > step.number ? 'bg-primary' : 'bg-outline-variant/40'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

