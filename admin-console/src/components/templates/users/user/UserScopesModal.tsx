import { Stack } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";
import ModalBox from "components/molecules/ModalBox";

interface UserScopesModalProps {
  isOpen: boolean;
  onClose: () => void;
  scopes: string[];
}

const UserScopesModal: FC<UserScopesModalProps> = ({ isOpen, onClose, scopes }) => {
  return (
    <ModalBox title={`User Scopes`} isOpen={isOpen} onCancel={onClose}>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {scopes?.map((scope) => (
          <StatusChip key={scope} label={scope} />
        ))}
      </Stack>
    </ModalBox>
  );
};

export default UserScopesModal;
