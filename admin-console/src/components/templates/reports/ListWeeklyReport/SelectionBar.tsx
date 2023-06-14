import { Button, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ControlledSelect from "components/molecules/ControlledSelect";

interface ResourceFilterBarProps {
  providers: any[];
  fetchWeeklyReport?: any;
  handleProviderChange: any;
  availableDates: any[];
  selectedProviders: any[];
  handleDateChange: any;
  selectedDate: string;
}

const ResourceFilterBar: FC<ResourceFilterBarProps> = ({
  providers,
  fetchWeeklyReport,
  handleProviderChange,
  availableDates,
  selectedProviders,
  handleDateChange,
  selectedDate,
}) => {
  const navigate = useNavigate();

  const providerSelectMapping = useMemo(() => {
    return providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) }));
  }, [providers]);

  const dateSelectMapping = useMemo(() => {
    return availableDates?.map((date) => ({ label: date, value: date }));
  }, [availableDates]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ControlledSelect placeholder="Select Providers" value={selectedProviders} onChange={handleProviderChange} list={providerSelectMapping} multiple sx={{ width: "300px" }} />
        <ControlledSelect placeholder="Select Available Date" value={selectedDate} onChange={handleDateChange} list={dateSelectMapping} sx={{ width: "300px" }} />
        <Button variant="contained" color="primary" size="small" onClick={fetchWeeklyReport} disabled={!selectedProviders?.length || !selectedDate}>
          Get Report
        </Button>
      </Stack>
      <Button variant="contained" color="primary" size="small" onClick={() => navigate("generate")}>
        Generate New Report
      </Button>
    </Stack>
  );
};

export default ResourceFilterBar;
