import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOpenstackNetworkProps {
  fetchOpenstackNetworks: any;
  exportOpenstackNetworks: any;
}

const ListOpenstackNetworks: FC<ListOpenstackNetworkProps> = ({ fetchOpenstackNetworks, exportOpenstackNetworks }) => {
  const rootState = useSelector((state: any) => state);
  const openstackNetworks = providersRedux.getters.openstackNetworks(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Network Name" },
      { label: "Network Type", align: "center" },
      { label: "Availability Zones", align: "center" },
      { label: "Port Security Enabled", align: "center" },
      { label: "Admin State Up", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Network Name", "Network Type", "Availability Zones", "Port Security Enabled", "Admin State Up", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item["provider:network_type"], align: "center" },
      { content: item?.availability_zones?.join(", "), align: "center" },
      { content: item?.port_security_enabled !== null ? <StatusChip label={item?.port_security_enabled} /> : null, align: "center" },
      { content: item?.admin_state_up !== null ? <StatusChip label={item?.admin_state_up} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created_at, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item["provider:network_type"],
      item?.availability_zones?.join(", "),
      item?.port_security_enabled,
      item?.admin_state_up,
      item?.status?.toUpperCase(),
      formatDate(item?.created_at, false, true, true),
    ];
  }, []);

  const reload = useCallback(fetchOpenstackNetworks, [fetchOpenstackNetworks]);

  const dataList = useDataList({
    data: openstackNetworks?.list || [],
    columns,
    exportFilename: "Openstack Networks List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportOpenstackNetworks,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListOpenstackNetworks;
