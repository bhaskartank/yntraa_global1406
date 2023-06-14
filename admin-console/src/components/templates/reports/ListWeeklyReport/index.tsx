import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";
import reportsRedux from "store/modules/reports";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import SelectionBar from "./SelectionBar";

interface ListWeeklyReportProps {
  fetchWeeklyReport: any;
  exportWeeklyReport: any;
  handleProviderChange: any;
  availableDates: any[];
  selectedProviders: any[];
  handleDateChange: any;
  selectedDate: string;
}

const ListWeeklyReport: FC<ListWeeklyReportProps> = ({
  fetchWeeklyReport,
  exportWeeklyReport,
  handleProviderChange,
  availableDates,
  selectedProviders,
  handleDateChange,
  selectedDate,
}) => {
  const rootState = useSelector((state: any) => state);
  const weeklyReport = reportsRedux.getters.weeklyReport(rootState);
  const providers = providersRedux.getters.providers(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Organisation" },
      { label: "Cloud Reg. A/C No." },
      { label: "Allocated VM", align: "center" },
      { label: "Consumed VM", align: "center" },
      { label: "Allocated CPU", align: "center" },
      { label: "Consumed CPU", align: "center" },
      { label: "Allocated Memory", align: "center" },
      { label: "Consumed Memory", align: "center" },
      { label: "Allocated Storage", align: "center" },
      { label: "Consumed Storage", align: "center" },
      { label: "Provider ID" },
      { label: "Provider Location" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Organisation",
      "Cloud Reg. A/C No.",
      "Allocated VM",
      "Consumed VM",
      "Allocated CPU",
      "Consumed CPU",
      "Allocated Memory",
      "Consumed Memory",
      "Allocated Storage",
      "Consumed Storage",
      "Provider ID",
      "Provider Location",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.organisation_name },
      { content: item?.org_reg_code },
      { content: item?.vm_allocated, align: "center" },
      { content: item?.vm_consumed || "0", align: "center" },
      { content: item?.cpu_allocated, align: "center" },
      { content: item?.cpu_consumed || "0", align: "center" },
      { content: item?.memory_allocated, align: "center" },
      { content: item?.memory_consumed || "0", align: "center" },
      { content: item?.storage_allocated, align: "center" },
      { content: item?.storage_consumed || "0", align: "center" },
      { content: item?.provider_id },
      { content: item?.provider_location },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.organisation_name,
      item?.org_reg_code,
      item?.vm_allocated,
      item?.vm_consumed,
      item?.cpu_allocated,
      item?.cpu_consumed,
      item?.memory_allocated,
      item?.memory_consumed,
      item?.storage_allocated,
      item?.storage_consumed,
      item?.provider_id,
      item?.provider_location,
    ];
  }, []);

  // const reload = useCallback(
  //   ({ limit, offset, search, order, orderBy, filters }) => fetchWeeklyReport({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
  //   [fetchWeeklyReport],
  // );

  const dataList = useDataList({
    data: weeklyReport?.list || [],
    // totalRecords: weeklyReport?.totalRecords,
    columns,
    exportFilename: "Resource Utilization List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportWeeklyReport,
    // reload
  });

  return (
    <>
      <SelectionBar
        providers={providers?.list?.data || []}
        fetchWeeklyReport={fetchWeeklyReport}
        handleProviderChange={handleProviderChange}
        availableDates={availableDates}
        selectedProviders={selectedProviders}
        handleDateChange={handleDateChange}
        selectedDate={selectedDate}
      />
      <DataList dataList={dataList} />;
    </>
  );
};

export default ListWeeklyReport;
