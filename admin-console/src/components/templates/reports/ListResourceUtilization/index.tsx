import { Box, Stack, Tooltip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";
import reportsRedux from "store/modules/reports";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import SelectionBar from "./SelectionBar";

interface ListResourceUtilizationProps {
  fetchResourceUtilization: any;
  exportResourceUtilization: any;
  handleProviderChange: any;
  selectedProvider: any;
  handleDateChange: any;
  date: Date;
  handleReportTypeChange: any;
  reportType: any;
}

const ListResourceUtilization: FC<ListResourceUtilizationProps> = ({
  fetchResourceUtilization,
  exportResourceUtilization,
  handleProviderChange,
  selectedProvider,
  handleDateChange,
  date,
  handleReportTypeChange,
  reportType,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const resourceUtilization = reportsRedux.getters.resourceUtilization(rootState);
  const providers = providersRedux.getters.providers(rootState);

  const tableData = useMemo(() => {
    return resourceUtilization?.list?.map((item) => ({ ...item, id: item?.organisation_id }));
  }, [resourceUtilization]);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Organisation" },
      { label: "Cloud Reg. A/C No." },
      { label: "Allocated VM", align: "center" },
      { label: "Consumed VM", align: "center" },
      { label: "Allocated VCPUs", align: "center" },
      { label: "Consumed VCPUs", align: "center" },
      { label: "Allocated RAM", align: "center" },
      { label: "Consumed RAM", align: "center" },
      { label: "Allocated Storage", align: "center" },
      { label: "Consumed Storage", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Allocated VM",
      "Consumed VM",
      "Allocated VCPUs",
      "Consumed VCPUs",
      "Allocated RAM",
      "Consumed RAM",
      "Allocated Storage",
      "Consumed Storage",
    ],
    [],
  );

  const getTopupDetails = useCallback((quota) => {
    const baseQuota = quota?.quotapackage_breakup?.find((item) => !!item?.base?.value);
    const topupQuota = quota?.quotapackage_breakup?.find((item) => !!item?.topup?.value);

    const baseQuotaValue = baseQuota?.base?.value || 0;
    const topupQuotaValue = topupQuota?.topup?.value || 0;

    return (
      <Stack direction="row" alignItems="center" justifyContent="center" spacing="4px">
        <Box component="span">{baseQuotaValue + topupQuotaValue}</Box>
        {topupQuotaValue ? (
          <Box component="span" whiteSpace="nowrap">
            (
            <Tooltip title="Base">
              <span>{baseQuotaValue}</span>
            </Tooltip>{" "}
            +{" "}
            <Tooltip title="Topup">
              <span>{topupQuotaValue}</span>
            </Tooltip>
            )
          </Box>
        ) : null}
      </Stack>
    );
  }, []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) =>
      reportType === "User Resources"
        ? [
            {
              content: (
                <Stack>
                  <Box component="span">{item?.action_log[0]?.organisation?.name}</Box>
                  <Box component="span">({item?.action_log[0]?.organisation?.org_id})</Box>
                </Stack>
              ),
            },
            { content: item?.action_log[0]?.organisation?.org_reg_code },
            { content: getTopupDetails(item?.action_log[0]?.resource_action_log?.vm?.allocated), align: "center" },
            { content: item?.action_log[0]?.resource_action_log?.vm?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.action_log[0]?.resource_action_log?.vcpu?.allocated), align: "center" },
            { content: item?.action_log[0]?.resource_action_log?.vcpu?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.action_log[0]?.resource_action_log?.ram?.allocated), align: "center" },
            { content: item?.action_log[0]?.resource_action_log?.ram?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.action_log[0]?.resource_action_log?.storage?.allocated), align: "center" },
            { content: item?.action_log[0]?.resource_action_log?.storage?.consumed?.value || "0", align: "center" },
          ]
        : [
            {
              content: (
                <Stack>
                  <Box component="span">{item?.action_log[0]?.organisation?.name}</Box>
                  <Box component="span">({item?.action_log[0]?.organisation?.org_id})</Box>
                </Stack>
              ),
            },
            { content: item?.action_log[0]?.organisation?.org_reg_code },
            { content: getTopupDetails(item?.including_internal_resources?.vm?.allocated), align: "center" },
            { content: item?.including_internal_resources?.vm?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.including_internal_resources?.vcpu?.allocated), align: "center" },
            { content: item?.including_internal_resources?.vcpu?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.including_internal_resources?.ram?.allocated), align: "center" },
            { content: item?.including_internal_resources?.ram?.consumed?.value || "0", align: "center" },
            { content: getTopupDetails(item?.including_internal_resources?.storage?.allocated), align: "center" },
            { content: item?.including_internal_resources?.storage?.consumed?.value || "0", align: "center" },
          ],
    [getTopupDetails, reportType],
  );

  const exportCreator = useCallback(
    (item: any) => {
      return reportType === "User Resources"
        ? [
            item?.action_log[0]?.organisation?.name,
            item?.action_log[0]?.organisation?.org_id,
            item?.action_log[0]?.organisation?.org_reg_code,
            getTopupDetails(item?.action_log[0]?.resource_action_log?.vm?.allocated),
            item?.action_log[0]?.resource_action_log?.vm?.consumed?.value,
            getTopupDetails(item?.action_log[0]?.resource_action_log?.vcpu?.allocated),
            item?.action_log[0]?.resource_action_log?.vcpu?.consumed?.value,
            getTopupDetails(item?.action_log[0]?.resource_action_log?.ram?.allocated),
            item?.action_log[0]?.resource_action_log?.ram?.consumed?.value,
            getTopupDetails(item?.action_log[0]?.resource_action_log?.storage?.allocated),
            item?.action_log[0]?.resource_action_log?.storage?.consumed?.value,
          ]
        : [
            item?.action_log[0]?.organisation?.name,
            item?.action_log[0]?.organisation?.org_id,
            item?.action_log[0]?.organisation?.org_reg_code,
            getTopupDetails(item?.including_internal_resources?.vm?.allocated),
            item?.including_internal_resources?.vm?.consumed?.value,
            getTopupDetails(item?.including_internal_resources?.vcpu?.allocated),
            item?.including_internal_resources?.vcpu?.consumed?.value,
            getTopupDetails(item?.including_internal_resources?.ram?.allocated),
            item?.including_internal_resources?.ram?.consumed?.value,
            getTopupDetails(item?.including_internal_resources?.storage?.allocated),
            item?.including_internal_resources?.storage?.consumed?.value,
          ];
    },
    [reportType, getTopupDetails],
  );

  const actions: ActionProps[] = [
    {
      label: () => "View Complete Info",
      onClick: (item) => {
        navigate(`${item?.organisation_id}/details`, {
          state: {
            utilizationDetails: reportType === "User Resources" ? item?.action_log[0]?.resource_action_log : item?.including_internal_resources,
            organisation: item?.action_log[0]?.organisation,
          },
        });
      },
    },
  ];

  const dataList = useDataList({
    data: tableData || [],
    columns,
    exportFilename: "Resource Utilization List",
    exportColumns,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportResourceUtilization,
  });

  return (
    <>
      <SelectionBar
        providers={providers?.list?.data || []}
        fetchResourceUtilization={fetchResourceUtilization}
        handleProviderChange={handleProviderChange}
        selectedProvider={selectedProvider}
        handleDateChange={handleDateChange}
        date={date}
        handleReportTypeChange={handleReportTypeChange}
        selectedReportType={reportType}
      />
      <DataList dataList={dataList} />;
    </>
  );
};

export default ListResourceUtilization;
