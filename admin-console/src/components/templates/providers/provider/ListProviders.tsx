import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

import ProviderSummaryPanel from "../resourceSummaryPanels/ProviderSummaryPanel";

interface ListProviderProps {
  fetchProviders: any;
  exportProviders: any;
  testConnection: (payload: any) => void;
  setSelectedProvider: React.Dispatch<any>;
  fetchPublicKeys: (providerId: number) => void;
  syncImageWithHorizon: (providerId: number) => void;
  syncFlavorWithHorizon: (providerId: number) => void;
}

const ListProviders: FC<ListProviderProps> = ({
  fetchProviders,
  exportProviders,
  testConnection,
  setSelectedProvider,
  fetchPublicKeys,
  syncImageWithHorizon,
  syncFlavorWithHorizon,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const providers = providersRedux.getters.providers(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Provider ID" },
      { label: "Name", align: "center" },
      { label: "Location", align: "center" },
      { label: "Description", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "provider_name", label: "Provider Name" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_id", label: "Provider ID" },
      { key: "provider_description", label: "Provider Description" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Provider ID", "Name", "Location", "Description", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.provider_id },
      { content: item?.provider_name, align: "center" },
      { content: item?.provider_location, align: "center" },
      { content: item?.provider_description, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.provider_id, item?.provider_name, item?.provider_location, item?.provider_description, item?.status?.toUpperCase(), formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { provider: item } }),
    },
    {
      label: () => "Test Connection",
      confirmation: (item) => ({
        title: "Test Connection",
        description: "Are you sure you want to test the connection for this provider?",
        resourceDetails: <ProviderSummaryPanel provider={item} />,
      }),
      onClick: (item) => testConnection({ provider_id: item?.id }),
    },
    {
      label: () => "Manage Attached Quota Package",
      onClick: (item) => navigate(`/providers/${item?.id}/attached-quota`, { state: { provider: item } }),
    },
    {
      label: () => "Manage Resource Topup",
      onClick: (item) => navigate(`/providers/${item?.id}/resource-topup`, { state: { provider: item } }),
    },
    {
      label: () => "Manage Availability Zones",
      onClick: (item) => navigate("/providers/availability-zones", { state: { defaultFilters: { provider_id: [item?.id] } } }),
    },
    {
      label: () => "Manage Flavors",
      onClick: (item) => navigate("/providers/flavors", { state: { defaultFilters: { provider_id: [item?.id] } } }),
    },
    {
      label: () => "Manage Images",
      onClick: (item) => navigate("/providers/images", { state: { defaultFilters: { provider_id: [item?.id] } } }),
    },
    {
      label: () => "Sync Image with Horizon",
      onClick: (item) => syncImageWithHorizon(item?.id),
    },
    {
      label: () => "Sync Flavor with Horizon",
      onClick: (item) => syncFlavorWithHorizon(item?.id),
    },
    {
      label: () => "Manage Default Security Rules",
      onClick: (item) => navigate("/providers/default-rules", { state: { defaultFilters: { provider_id: [item?.id] } } }),
    },
    {
      label: () => "Provider Resource Mapping",
      onClick: (item) => navigate(`/providers/${item?.id}/resource-mapping`, { state: { provider: item } }),
    },
    {
      label: () => "Manage Service Providers",
      onClick: (item) => navigate(`/providers/${item?.id}/service-providers`, { state: { provider: item } }),
    },
    {
      label: () => "Manage Public Key",
      onClick: (item) => {
        setSelectedProvider(item);
        fetchPublicKeys(item?.id);
      },
    },
    {
      label: () => "Manage Resource Metrics",
      onClick: (item) => navigate("/providers/resource-metrics", { state: { defaultFilters: { provider_id: [item?.id] } } }),
    },
    {
      label: () => "Hypervisor Details",
      onClick: (item) => navigate(`/providers/${item?.id}/hypervisors-info`, { state: { provider: item } }),
    },
    {
      label: () => "Openstack Network Details",
      onClick: (item) => navigate(`/providers/${item?.id}/openstack-nws`, { state: { provider: item } }),
    },
    {
      label: () => "Openstack Subnets",
      onClick: (item) => navigate(`/providers/${item?.id}/openstack-subnets`, { state: { provider: item } }),
    },
    {
      label: () => "Openstack Ports",
      onClick: (item) => navigate(`/providers/${item?.id}/openstack-ports`, { state: { provider: item } }),
    },
    {
      label: () => "Openstack Floating IP",
      onClick: (item) => navigate(`/providers/${item?.id}/openstack-floating-ip`, { state: { provider: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Provider"] } } }),
    },
  ];

  const reload = useCallback(fetchProviders, [fetchProviders]);

  const dataList = useDataList({
    data: providers?.list?.data || [],
    totalRecords: providers?.totalRecords,
    columns,
    exportFilename: "Providers List",
    exportColumns,
    actions,
    createResourceButton: { text: "Create Provider", onClick: () => navigate("create") },
    rowCreator,
    exportCreator,
    searchFields,
    listExporter: exportProviders,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProviders;
