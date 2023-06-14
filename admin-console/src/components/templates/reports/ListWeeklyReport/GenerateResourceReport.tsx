import { Box, Button, Stack, Typography } from "@mui/material";
import moment from "moment";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatusChip from "components/atoms/StatusChip";
import { DateCalendar } from "components/molecules/DatePicker";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface GenerateResourceReportProps {
  providers: any[];
  generateResourceReport: (payload: any, navigateBack: boolean) => void;
}

const GenerateResourceReport: FC<GenerateResourceReportProps> = ({ providers, generateResourceReport }) => {
  const navigate = useNavigate();

  const [date, setDate] = useState<Date>(null);

  const yesterdayDate = useMemo(() => {
    return moment()?.subtract(1, "days")?.toDate();
  }, []);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Provider ID" }, { label: "Name", align: "center" }, { label: "Status", align: "center" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.provider_id },
      { content: item?.provider_name, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
    ],
    [],
  );

  const dataList = useDataList({ data: providers, columns, hideViewColumn: true, checkbox: true, rowCreator });

  const handleGenerateReport = (navigateBack = false) => {
    generateResourceReport({ provider_id: dataList?.checkedRows, log_date: moment(date).format("YYYY-MM-DD") }, navigateBack);

    dataList?.handleClearAllCheckedRows();
    setDate(null);
  };

  return (
    <Stack justifyContent="space-between" sx={{ height: "100%", color: "#000" }}>
      <Stack direction={"row"} justifyContent={"space-between"} flexWrap="wrap" spacing={{ xs: 2, md: 4 }} sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Stack flex={{ xs: 1, md: 5 }}>
          <Typography variant="h5" fontWeight="normal">
            Select Providers
          </Typography>

          <DataList dataList={dataList} />
        </Stack>
        <Stack flex={{ xs: 1, md: 3 }}>
          <Typography variant="h5" fontWeight="normal">
            Select Date
          </Typography>

          <Box mt={2}>
            <DateCalendar value={date} onChange={setDate} max={yesterdayDate} />
          </Box>
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" p={2} spacing={2}>
        <Button color="inherit" variant="outlined" onClick={() => navigate("/reports/weekly-report")}>
          Cancel
        </Button>
        <Button color="primary" variant="outlined" disabled={!date || !dataList?.checkedRows?.length} onClick={() => handleGenerateReport(true)}>
          Generate and Go Back
        </Button>
        <Button color="primary" variant="contained" disabled={!date || !dataList?.checkedRows?.length} onClick={() => handleGenerateReport(false)}>
          Generate
        </Button>
      </Stack>
    </Stack>
  );
};

export default GenerateResourceReport;
