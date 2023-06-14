import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOpenstackPortProps {
  fetchOpenstackPorts: any;
  exportOpenstackPorts: any;
}

const ListOpenstackPorts: FC<ListOpenstackPortProps> = ({ fetchOpenstackPorts, exportOpenstackPorts }) => {
  const rootState = useSelector((state: any) => state);
  const openstackPorts = providersRedux.getters.openstackPorts(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Port Name" },
      { label: "MAC Address", align: "center" },
      { label: "VIF Type", align: "center" },
      { label: "VNIC Type", align: "center" },
      { label: "Revision Number", align: "center" },
      { label: "Attached Device", align: "center" },
      { label: "Fixed IP", align: "center" },
      { label: "Port Security Enabled", align: "center" },
      { label: "Admin State Up", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(
    () => ["Port Name", "MAC Address", "VIF Type", "VNIC Type", "Revision Number", "Attached Device", "Fixed IP", "Port Security Enabled", "Admin State Up", "Status", "Created"],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.mac_address, align: "center" },
      { content: item["binding:vif_type"], align: "center" },
      { content: item["binding:vnic_type"], align: "center" },
      { content: item?.revision_number, align: "center" },
      { content: item?.device_owner, align: "center" },
      { content: item?.fixed_ips?.length ? item?.fixed_ips[0]?.ip_address : null, align: "center" },
      { content: item?.port_security_enabled ? <StatusChip label={item?.port_security_enabled} /> : null, align: "center" },
      { content: item?.admin_state_up ? <StatusChip label={item?.admin_state_up} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created_at, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.mac_address,
      item["binding:vif_type"],
      item["binding:vnic_type"],
      item?.revision_number,
      item?.device_owner,
      item?.fixed_ips?.length ? item?.fixed_ips[0]?.ip_address : null,
      item?.port_security_enabled,
      item?.admin_state_up,
      item?.status?.toUpperCase(),
      formatDate(item?.created_at, false, true, true),
    ];
  }, []);

  const reload = useCallback(fetchOpenstackPorts, [fetchOpenstackPorts]);

  const dataList = useDataList({
    data: openstackPorts?.list || [],
    columns,
    exportFilename: "Openstack Ports List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportOpenstackPorts,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListOpenstackPorts;
