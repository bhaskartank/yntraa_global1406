import { Box, Button, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import SelectPopper from "components/atoms/SelectPopper";

import { appRoutes } from "utils/constants";

import { SelectDropdownIcon } from "assets/icons";

const OrganisationPopover: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const sessionContext = authRedux.getters.sessionContext(rootState);
  const availableDomains = authRedux.getters.availableDomains(rootState);
  const availableProjectsByOrgId = authRedux.getters.availableProjectsByOrgId(rootState);
  const availableProvidersByOrgProjId = authRedux.getters.availableProvidersByOrgProjId(rootState);

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  const handleSelectOrganisation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOrganisation((event.target as HTMLInputElement).value);
    setSelectedProject(null);
    setSelectedProvider(null);
  };

  const handleSelectProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProject((event.target as HTMLInputElement).value);
    setSelectedProvider(null);
  };

  const handleSelectProvider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProvider((event.target as HTMLInputElement).value);
  };

  const handleSave = () => {
    if (selectedOrganisation && selectedProject && selectedProvider) {
      dispatch(authRedux.actions.updateSessionContext({ organisationId: selectedOrganisation, projectId: selectedProject, providerId: selectedProvider }));
      navigate(appRoutes.DASHBOARD);
    }

    handleClosePopover();
  };

  useEffect(() => {
    if (sessionContext) {
      setSelectedOrganisation(sessionContext?.organisationId);
      setSelectedProject(sessionContext?.projectId);
      setSelectedProvider(sessionContext?.providerId);
    }
  }, [sessionContext, openPopover]);

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleOpenPopover} ref={anchorRef} endIcon={<SelectDropdownIcon />}>
        Select Organization
      </Button>
      <SelectPopper
        anchorEl={anchorRef.current}
        handleClose={handleClosePopover}
        title=""
        icon={null}
        onSubmit={handleSave}
        open={openPopover}
        submitDisabled={!(selectedOrganisation && selectedProject && selectedProvider)}>
        <Stack gap={2} divider={<Divider />}>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Select Organization
            </Typography>
            <FormControl sx={{ maxHeight: "180px", overflowY: "auto" }}>
              <RadioGroup value={selectedOrganisation} onChange={handleSelectOrganisation}>
                {availableDomains?.map((domain) => (
                  <FormControlLabel key={domain?.organisation?.id} value={domain?.organisation?.id} control={<Radio />} label={domain?.organisation?.name} sx={{ my: 1 }} />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          <Stack direction="row" gap={3} divider={<Divider flexItem orientation="vertical" />}>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Select Project
              </Typography>
              <FormControl sx={{ maxHeight: "180px", overflowY: "auto" }}>
                <RadioGroup value={selectedProject} onChange={handleSelectProject}>
                  {availableProjectsByOrgId(selectedOrganisation)?.map((project) => (
                    <FormControlLabel key={project?.id} value={project?.id} control={<Radio />} label={project?.name} sx={{ my: 1 }} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>

            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Select Provider
              </Typography>
              <FormControl sx={{ maxHeight: "180px", overflowY: "auto" }}>
                <RadioGroup value={selectedProvider} onChange={handleSelectProvider}>
                  {availableProvidersByOrgProjId(selectedOrganisation, selectedProject)?.map((projectProviderMapping) => (
                    <FormControlLabel
                      key={projectProviderMapping?.provider?.id}
                      value={projectProviderMapping?.provider?.id}
                      control={<Radio />}
                      label={projectProviderMapping?.provider?.provider_name}
                      sx={{ my: 1 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Stack>
        </Stack>
      </SelectPopper>
    </>
  );
};

export default OrganisationPopover;
