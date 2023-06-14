import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListResourceMetricProps {
  fetchResourceMetrics: any;
  exportResourceMetrics: any;
  deleteResourceMetric: (resourceMetricId: number) => void;
  defaultFilters: any;
}

const ListResourceMetrics: FC<ListResourceMetricProps> = ({ fetchResourceMetrics, exportResourceMetrics, deleteResourceMetric, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const resourceMetrics = providersRedux.getters.resourceMetrics(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Metric Level", sortKey: "metric_level", filterKey: "metric_level", filters: resourceMetrics?.list?.filter_values?.metric_level },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: resourceMetrics?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: resourceMetrics?.list?.filter_values?.provider_location },
      { label: "Resource Type", align: "center", sortKey: "resource_type", filterKey: "resource_type", filters: resourceMetrics?.list?.filter_values?.resource_type },
      { label: "Report Label", align: "center", sortKey: "report_label", filterKey: "report_label", filters: resourceMetrics?.list?.filter_values?.report_label },
      { label: "Y Axis Label", align: "center", sortKey: "y_label", filterKey: "y_label", filters: resourceMetrics?.list?.filter_values?.y_label },
      { label: "X Axis Label", align: "center", sortKey: "x_label", filterKey: "x_label", filters: resourceMetrics?.list?.filter_values?.x_label },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [resourceMetrics?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => ["Metric Level", "Provider Name", "Provider ID", "Provider Location", "Resource Type", "Report Label", "Y Axis Label", "X Axis Label", "Created"],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.metric_level },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.provider?.provider_name}</Box>
            <Box>({item?.provider?.provider_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.provider?.provider_location, align: "center" },
      { content: item?.resource_type, align: "center" },
      { content: item?.report_label, align: "center" },
      { content: item?.y_label, align: "center" },
      { content: item?.x_label, align: "center" },
      { content: formatDate(item?.created, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.metric_level,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.resource_type,
      item?.report_label,
      item?.y_label,
      item?.x_label,
      formatDate(item?.created, false, true, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "metric_level", label: "Metric Level" },
      { key: "resource_type", label: "Resource Type" },
      { key: "report_label", label: "Report Label" },
      { key: "y_label", label: "Y Label" },
      { key: "x_label", label: "X Label" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Update Resource Details",
      onClick: (item) => navigate(`${item?.id}/update`, { state: { resourceMetric: item } }),
    },
    {
      label: () => "Delete Resource Metric",
      confirmation: () => ({
        title: "Delete Resource Metric",
        description: "Are you sure you want to delete resource metric?",
      }),
      onClick: (item) => deleteResourceMetric(item?.id),
      color: "error.main",
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ResourceMetrice"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchResourceMetrics({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchResourceMetrics],
  );

  const dataList = useDataList({
    data: resourceMetrics?.list?.data || [],
    totalRecords: resourceMetrics?.totalRecords,
    columns,
    exportFilename: "Resource Metrics List",
    exportColumns,
    searchFields,
    actions,
    createResourceButton: { text: "Create Resource Metric", onClick: () => navigate("create") },
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportResourceMetrics,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListResourceMetrics;
