import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import projectsRedux from "store/modules/projects";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListProjectProviderMappingProps {
  fetchProjectProviderMapping: any;
  createGateway: any;
  deleteGateway: any;
  deleteProject: any;
  reInitProject: any;
}

const ListProjectProviderMapping: FC<ListProjectProviderMappingProps> = ({ fetchProjectProviderMapping, createGateway, deleteGateway, deleteProject, reInitProject }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const projectProviderMapping = projectsRedux.getters.projectProviderMapping(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Provider Name" }, { label: "Gateway IP" }, { label: "Initialized On" }, { label: "Status", align: "center" }], []);

  const exportColumns: string[] = useMemo(() => ["Provider Name", "Gateway IP", "Initialized On", "Status"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.provider?.provider_name },
      { content: item?.gw_device_ip },
      { content: formatDate(item?.created) },
      { content: item?.action ? <StatusChip label={item?.action} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.provider?.provider_name, item?.gw_device_ip, formatDate(item?.created, false, true), item?.action];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Project Re-Init",
      confirmation: () => ({
        title: "Project Re-Init",
        description: "Are you sure you want to Re-Initialize this Project?",
      }),
      onClick: (item) => reInitProject(item?.provider_id),
    },
    {
      label: () => "Project Resource Details",
      onClick: (item) => navigate(`/organisations/projects/${item?.project_id}/providers/${item?.provider_id}/resources`, { state: { provider: item } }),
    },
    {
      label: () => "Create Security Group",
      onClick: (item) => navigate(`/organisations/projects/${item?.project_id}/providers/${item?.provider_id}/create-security-group`, { state: { providerMapping: item } }),
    },
    {
      label: () => "Apply Default Rules",
      onClick: (item) => navigate(`/organisations/projects/${item?.project_id}/providers/${item?.provider_id}/apply-default-rule`, { state: { providerMapping: item } }),
    },
    {
      label: () => "Manage Gateway Services",
      onClick: (item) => navigate(`/organisations/projects/${item?.project_id}/providers/${item?.provider_id}/gateway-services`, { state: { providerMapping: item } }),
    },
    {
      label: () => "Create Gateway",
      confirmation: () => ({
        title: "Create Gateway",
        description: "Are you sure you want to create gateway?",
      }),
      onClick: (item) => createGateway(item?.provider_id),
    },
    {
      label: () => "Delete Gateway",
      confirmation: () => ({
        title: "Delete Gateway",
        description: "Are you sure you want to delete this gateway?",
      }),
      onClick: (item) => deleteGateway(item?.provider_id),
      color: "error.main",
    },
    {
      label: () => "Delete Project",
      confirmation: () => ({
        title: "Delete Project",
        description: "Are you sure you want to delete this Project?",
      }),
      onClick: (item) => deleteProject(item?.provider_id),
      color: "error.main",
    },
  ];

  const reload = useCallback(() => fetchProjectProviderMapping(), [fetchProjectProviderMapping]);

  const dataList = useDataList({
    data: projectProviderMapping,
    columns,
    actions,
    exportFilename: "Project Provider Mapping List",
    exportColumns,
    rowCreator,
    exportCreator,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProjectProviderMapping;
