import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface SyncAvailabilityZoneProps {
  handleSync: any;
  providers: any[];
}

const SyncAvailabilityZones: FC<SyncAvailabilityZoneProps> = ({ handleSync, providers }) => {
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const providerSelectMapping = useMemo(() => {
    return providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) }));
  }, [providers]);

  const resourceSelectMapping = useMemo(() => {
    return [
      { label: "Compute", value: "compute" },
      { label: "Network", value: "network" },
    ];
  }, []);

  const handleSelectProvider = useCallback((values) => {
    setSelectedProvider(values);
  }, []);

  const handleSelectResource = useCallback((values) => {
    setSelectedResource(values);
  }, []);

  const onSubmit = useCallback(() => {
    handleSync({ providerId: selectedProvider, resourceName: selectedResource });
    setSelectedProvider(null);
    setSelectedResource(null);
  }, [handleSync, selectedProvider, selectedResource]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Provider" value={selectedProvider} onChange={handleSelectProvider} list={providerSelectMapping} />
        <ControlledSelect placeholder="Select Resource Name" value={selectedResource} onChange={handleSelectResource} list={resourceSelectMapping} />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={onSubmit} disabled={!selectedProvider || !selectedResource}>
        Sync Availability Zones
      </Button>
    </Stack>
  );
};

export default SyncAvailabilityZones;
