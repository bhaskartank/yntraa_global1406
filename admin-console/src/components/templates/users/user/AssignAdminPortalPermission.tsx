import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface AssignAdminPortalRoleProps {
  handleAssign: any;
  providers: any[];
  roles: any[];
}

const AssignAdminPortalRoles: FC<AssignAdminPortalRoleProps> = ({ handleAssign, providers, roles }) => {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const roleSelectMapping = useMemo(() => {
    return roles?.map((role) => ({ label: role?.group_name, value: String(role?.id) }))?.sort((a, b) => (a?.label?.toLowerCase() > b?.label?.toLowerCase() ? 1 : -1));
  }, [roles]);

  const providerSelectMapping = useMemo(() => {
    return providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) }));
  }, [providers]);

  const handleSelectProvider = useCallback((values) => {
    setSelectedProvider(values);
  }, []);

  const handleSelectRole = useCallback((values) => {
    setSelectedRole(values);
  }, []);

  const onSubmit = useCallback(() => {
    handleAssign({ provider_id: selectedProvider, role_permission_group_id: selectedRole });
    setSelectedProvider(null);
    setSelectedRole(null);
  }, [handleAssign, selectedProvider, selectedRole]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Provider" value={selectedProvider} onChange={handleSelectProvider} list={providerSelectMapping} />
        <ControlledSelect placeholder="Select Role" value={selectedRole} onChange={handleSelectRole} list={roleSelectMapping} />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={onSubmit} disabled={!selectedProvider || !selectedRole}>
        Assign Role
      </Button>
    </Stack>
  );
};

export default AssignAdminPortalRoles;
