import { Button, Stack } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface AssignServicePortalRoleProps {
  handleAssign: any;
  organisations: any[];
  roles: any[];
  fetchProject: (payload: any) => void;
  projects: any[];
}

const AssignServicePortalRoles: FC<AssignServicePortalRoleProps> = ({ handleAssign, organisations, roles, fetchProject, projects }) => {
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const [selectMapping, setSelectMapping] = useState<any>({ organisation: [], project: [], role: [] });

  useEffect(() => {
    setSelectMapping((current) => ({
      ...current,
      organisation: organisations?.map((organisation) => ({ label: `${organisation?.name} (${organisation?.org_id})`, value: String(organisation?.id) })),
    }));
  }, [organisations]);

  useEffect(() => {
    setSelectMapping((current) => ({
      ...current,
      project: projects?.map((project) => ({ label: `${project?.name} (${project?.project_id})`, value: String(project?.id) })),
    }));
  }, [projects]);

  useEffect(() => {
    setSelectMapping((current) => ({
      ...current,
      role: roles?.map((role) => ({ label: role?.group_name, value: String(role?.id) }))?.sort((a, b) => (a?.label?.toLowerCase() > b?.label?.toLowerCase() ? 1 : -1)),
    }));
  }, [roles]);

  const handleSelectOrganisation = useCallback((values) => {
    setSelectedOrganisation(values);
    setSelectMapping((current) => ({ ...current, project: [] }));
  }, []);

  const handleSelectProject = useCallback((values) => {
    setSelectedProject(values);
  }, []);

  const handleSelectRole = useCallback((values) => {
    setSelectedRole(values);
  }, []);

  const onSubmit = useCallback(() => {
    handleAssign(selectedOrganisation, selectedProject, selectedRole);
    setSelectedOrganisation(null);
    setSelectedProject(null);
    setSelectedRole(null);
    setSelectMapping((current) => ({ ...current, project: [] }));
  }, [handleAssign, selectedOrganisation, selectedProject, selectedRole]);

  useEffect(() => {
    if (selectedOrganisation) {
      fetchProject({ filters: JSON.stringify({ organisation_id: [selectedOrganisation] }) });
    }
  }, [fetchProject, selectedOrganisation]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Organisation" value={selectedOrganisation} onChange={handleSelectOrganisation} list={selectMapping?.organisation} />
        <ControlledSelect placeholder="Select Project" value={selectedProject} onChange={handleSelectProject} list={selectMapping?.project} />
        <ControlledSelect placeholder="Select Role" value={selectedRole} onChange={handleSelectRole} list={selectMapping?.role} />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={onSubmit} disabled={!selectedOrganisation || !selectedProject || !selectedRole}>
        Assign Role
      </Button>
    </Stack>
  );
};

export default AssignServicePortalRoles;
