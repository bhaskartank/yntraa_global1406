import { Button, Stack } from "@mui/material";
import { FC, useMemo } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface MapZonePanelProps {
  handleMap: any;
  selectedZone: any;
  handleSelectZone: any;
  zones: any;
}

const MapZonePanel: FC<MapZonePanelProps> = ({ handleMap, selectedZone, handleSelectZone, zones }) => {
  const zoneSelectMapping = useMemo(() => {
    return zones?.map((zone) => ({ label: `${zone?.zone_name} (${zone?.resource_name})`, value: String(zone?.id) }));
  }, [zones]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Zone" value={selectedZone} onChange={handleSelectZone} list={zoneSelectMapping} />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={handleMap} disabled={!selectedZone}>
        Map Zone
      </Button>
    </Stack>
  );
};

export default MapZonePanel;
