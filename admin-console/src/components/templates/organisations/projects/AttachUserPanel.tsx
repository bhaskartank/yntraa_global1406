import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface AttachUserPanelProps {
  handleAttach: any;
  users: any[];
  roles: any[];
}

const AttachUserPanels: FC<AttachUserPanelProps> = ({ handleAttach, users, roles }) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const userSelectMapping = useMemo(() => {
    return users?.map((user) => ({ label: user?.username, value: String(user?.id) }));
  }, [users]);

  const roleSelectMapping = useMemo(() => {
    return roles?.map((role) => ({ label: role?.group_name, value: String(role?.id) }));
  }, [roles]);

  const handleSelectUser = useCallback((values) => {
    setSelectedUser(values);
  }, []);

  const handleSelectRole = useCallback((values) => {
    setSelectedRole(values);
  }, []);

  const onSubmit = useCallback(() => {
    handleAttach(selectedUser, selectedRole);
    setSelectedUser(null);
    setSelectedRole(null);
  }, [handleAttach, selectedUser, selectedRole]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select User" value={selectedUser} onChange={handleSelectUser} list={userSelectMapping} />
        <ControlledSelect placeholder="Select Role" value={selectedRole} onChange={handleSelectRole} list={roleSelectMapping} />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={onSubmit} disabled={!selectedUser || !selectedRole}>
        Attach User
      </Button>
    </Stack>
  );
};

export default AttachUserPanels;
