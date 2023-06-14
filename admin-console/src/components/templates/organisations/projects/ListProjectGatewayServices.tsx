import { Button } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import projectsRedux from "store/modules/projects";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListProjectGatewayServiceProps {
  fetchProjectGatewayServices: any;
  updatedProjectGatewayServicesStatus: any;
  projectGatewayServiceAction: any;
}

const ListProjectGatewayServices: FC<ListProjectGatewayServiceProps> = ({ fetchProjectGatewayServices, updatedProjectGatewayServicesStatus, projectGatewayServiceAction }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const projectGatewayServices = projectsRedux.getters.projectGatewayServices(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Service Name" },
      { label: "Protocol" },
      { label: "Gateway Port" },
      { label: "Destination IP" },
      { label: "Status", align: "center" },
      { label: "Created" },
      { label: "Updated" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Service Name", "Protocol", "Gateway Port", "Destination IP", "Status", "Created", "Updated"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.service_name },
      { content: item?.service_protocol },
      { content: item?.service_gw_port },
      { content: item?.service_destination },
      { content: item?.device_status ? <StatusChip label={item?.device_status} /> : null, align: "center" },
      { content: formatDate(item?.created) },
      { content: formatDate(item?.updated) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.service_name,
      item?.service_protocol,
      item?.service_gw_port,
      item?.service_destination,
      item?.device_status,
      formatDate(item?.created, false, true),
      formatDate(item?.updated, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Start",
      confirmation: () => ({
        title: "Start Gateway Service",
        description: "Are you sure you want to start this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "start"),
    },
    {
      label: () => "Stop",
      confirmation: () => ({
        title: "Stop Gateway Service",
        description: "Are you sure you want to stop this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "stop"),
    },
    {
      label: () => "Pause",
      confirmation: () => ({
        title: "Pause Gateway Service",
        description: "Are you sure you want to pause this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "pause"),
    },
    {
      label: () => "Unpause",
      confirmation: () => ({
        title: "Unpause Gateway Service",
        description: "Are you sure you want to unpause this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "unpause"),
    },
    {
      label: () => "Restart",
      confirmation: () => ({
        title: "Restart Gateway Service",
        description: "Are you sure you want to restart this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "restart"),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ProjectGatewayService"] } } }),
    },
    {
      label: () => "Remove",
      confirmation: () => ({
        title: "Remove Gateway Service",
        description: "Are you sure you want to remove this gateway service?",
      }),
      onClick: (item) => projectGatewayServiceAction(item?.id, "remove"),
      color: "error.main",
    },
  ];

  const reload = useCallback(() => fetchProjectGatewayServices(), [fetchProjectGatewayServices]);

  const dataList = useDataList({
    data: projectGatewayServices,
    columns,
    actions,
    exportFilename: "Project Gateway Services List",
    exportColumns,
    createResourceButton: { text: "Create", onClick: () => navigate("create") },
    extraActions: (
      <>
        <Button color="info" variant="contained" onClick={updatedProjectGatewayServicesStatus}>
          Get Updated Status
        </Button>
      </>
    ),
    rowCreator,
    exportCreator,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProjectGatewayServices;
