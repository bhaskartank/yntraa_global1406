import { Button, Stack } from "@mui/material";
import moment from "moment";
import { FC, useMemo } from "react";

import ControlledSelect from "components/molecules/ControlledSelect";
import DatePicker from "components/molecules/DatePicker";

interface ResourceFilterBarProps {
  providers: any[];
  fetchResourceUtilization?: any;
  handleProviderChange: any;
  selectedProvider: any;
  handleDateChange: any;
  date: Date;
  handleReportTypeChange: any;
  selectedReportType: any;
}

const ResourceFilterBar: FC<ResourceFilterBarProps> = ({
  providers,
  fetchResourceUtilization,
  handleProviderChange,
  selectedProvider,
  handleDateChange,
  date,
  handleReportTypeChange,
  selectedReportType,
}) => {
  const providerSelectMapping = useMemo(() => {
    return providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) }));
  }, [providers]);

  const reportTypeSelectMapping = useMemo(() => {
    return [
      { label: "User Resources", value: "User Resources" },
      { label: "Including Internal Resources", value: "Including Internal Resources" },
    ];
  }, []);

  const yesterdayDate = useMemo(() => {
    return moment()?.subtract(1, "days")?.toDate();
  }, []);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ControlledSelect placeholder="Select Provider" value={selectedProvider} onChange={handleProviderChange} list={providerSelectMapping} firstAsDefault />
        <DatePicker value={date} onChange={handleDateChange} max={yesterdayDate} />
        <ControlledSelect placeholder="Select Report Type" value={selectedReportType} onChange={handleReportTypeChange} list={reportTypeSelectMapping} firstAsDefault />
      </Stack>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => fetchResourceUtilization({ log_date: moment(date)?.format("YYYY-MM-DD") })}
        disabled={!selectedProvider || !date}>
        List Resources
      </Button>
    </Stack>
  );
};

export default ResourceFilterBar;
