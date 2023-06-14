import { Stack } from "@mui/material";
import { FC, useMemo } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";

interface SelectResourceTypePanelProps {
  handleFetch?: any;
  selectedResource: any;
  handleSelectResource: any;
}

const SelectResourceTypePanel: FC<SelectResourceTypePanelProps> = ({ handleFetch, selectedResource, handleSelectResource }) => {
  const resourceSelectMapping = useMemo(() => {
    return [
      { label: "User", value: "false" },
      { label: "Including Internal", value: "true" },
    ];
  }, []);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Resource Type" value={selectedResource} onChange={handleSelectResource} list={resourceSelectMapping} firstAsDefault />
      </Stack>
    </Stack>
  );
};

export default SelectResourceTypePanel;
