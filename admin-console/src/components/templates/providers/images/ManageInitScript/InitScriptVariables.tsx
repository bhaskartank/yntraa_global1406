import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import ModalBox from "components/molecules/ModalBox";

interface InitScriptVariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  variables: any[];
}

const InitScriptVariablesModal: FC<InitScriptVariablesModalProps> = ({ isOpen, onClose, variables = [] }) => {
  return (
    <ModalBox title={`Init Script Variables`} isOpen={isOpen} onCancel={onClose}>
      <Stack spacing={1}>
        {variables?.map((variable) => (
          <Stack key={variable?.id} direction="row" spacing={1} alignItems="center">
            <Typography fontWeight="bold">[{variable?.variable_name}] :</Typography>
            <Typography>{variable?.variable_description}</Typography>
          </Stack>
        ))}
      </Stack>
    </ModalBox>
  );
};

export default InitScriptVariablesModal;
