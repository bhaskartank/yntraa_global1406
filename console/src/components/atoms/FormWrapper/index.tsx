import { Box, Button, Checkbox, Divider, FormControlLabel, Stack, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";

interface FormSectionProps {
  children: React.ReactNode;
  title?: string;
  icon?: ReactNode;
  isSkipped?: boolean;
  handleSkip?: (skip: boolean) => void;
  customStyle?: any;
}

export const FormSection: FC<FormSectionProps> = ({ children, title, icon, isSkipped, handleSkip, customStyle }) => {
  return (
    <Stack divider={<Divider flexItem />} gap={1} sx={{ p: 2, backgroundColor: "background.paper", borderRadius: "8px", color: "common.black", ...customStyle }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" gap="12px">
          {icon}
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
        </Stack>

        {handleSkip ? (
          <Stack direction="row" alignItems="center">
            <FormControlLabel label="Skip" control={<Checkbox size="small" checked={isSkipped} onChange={({ target }) => handleSkip(target?.checked)} />} sx={{ mr: 0 }} />
          </Stack>
        ) : null}
      </Stack>

      {!isSkipped ? <Box sx={{ height: "100%", overflowY: "auto" }}>{children}</Box> : null}
    </Stack>
  );
};

interface FormContainerProps {
  children: React.ReactNode;
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  customStyle?: any;
}

export const FormContainer: FC<FormContainerProps> = ({ children, onCancel, onSubmit, submitDisabled = false, customStyle }) => {
  return (
    <Stack gap={1} sx={{ overflow: "hidden", ...customStyle }}>
      <Box sx={{ flex: 1, overflowY: "auto", pb: 14 }}>{children}</Box>

      <Box sx={{ backgroundColor: "background.paper", position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid", borderColor: "divider", px: 3, py: 2 }}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={onCancel} sx={{ width: "140px" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSubmit} disabled={submitDisabled} sx={{ width: "140px" }}>
            Create
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};
