import { Box, Button, Divider, Stack, Step, StepButton, Stepper } from "@mui/material";
import { FC, ReactNode, useMemo, useState } from "react";

interface Step {
  label: string;
  content: ReactNode;
}

interface StepperFormProps {
  steps: Step[];
  completedSteps: { [step: number]: boolean };
  onSubmit: () => void;
  onCancel: () => void;
}

const StepperForm: FC<StepperFormProps> = ({ steps, completedSteps, onSubmit, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);

  const totalSteps = useMemo(() => steps?.length, [steps]);
  const totalCompletedSteps = useMemo(() => Object.keys(completedSteps)?.filter((step) => completedSteps[step])?.length, [completedSteps]);
  const isCurrentStepCompleted = useMemo(() => Boolean(completedSteps[activeStep]), [activeStep, completedSteps]);
  const isAllStepsCompleted = useMemo(() => totalCompletedSteps === totalSteps - 1, [totalCompletedSteps, totalSteps]);
  const isLastStep = useMemo(() => activeStep === totalSteps - 1, [activeStep, totalSteps]);

  const handleNext = () => {
    setActiveStep((current) => current + 1);
  };

  const handleBack = () => {
    setActiveStep((current) => current - 1);
  };

  const handleChangeStep = (step: number) => () => {
    if (completedSteps[step] || step < activeStep) {
      setActiveStep(step);
    }
  };

  return (
    <Stack width="100%" height="100%" divider={<Divider />}>
      <Stepper nonLinear activeStep={activeStep} sx={{ px: 2, py: 3, mx: 0, my: 0, backgroundColor: "primary.light" }}>
        {steps?.map((step, index) => (
          <Step key={step?.label} completed={!!completedSteps[index]}>
            <StepButton color="inherit" onClick={handleChangeStep(index)}>
              {step?.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box flex={1} p={3} sx={{ overflowY: "auto" }}>
        {steps[activeStep]?.content}
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} py={1}>
        <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {isLastStep ? (
          <Button variant="contained" onClick={onSubmit} disabled={!isAllStepsCompleted}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext} disabled={!isCurrentStepCompleted}>
            Next
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default StepperForm;
