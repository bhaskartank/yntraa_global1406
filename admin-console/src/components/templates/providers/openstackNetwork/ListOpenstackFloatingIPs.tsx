import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOpenstackFloatingIPProps {
  fetchOpenstackFloatingIPs: any;
  exportOpenstackFloatingIPs: any;
}

const ListOpenstackFloatingIPs: FC<ListOpenstackFloatingIPProps> = ({ fetchOpenstackFloatingIPs, exportOpenstackFloatingIPs }) => {
  const rootState = useSelector((state: any) => state);
  const openstackFloatingIPs = providersRedux.getters.openstackFloatingIPs(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Floating IP Address" },
      { label: "Fixed IP Address", align: "center" },
      { label: "Region", align: "center" },
      { label: "Port MAC Address", align: "center" },
      { label: "Revision Number", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Floating IP Address", "Fixed IP Address", "Region", "Port MAC Address", "Revision Number", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.floating_ip_address },
      { content: item?.fixed_ip_address, align: "center" },
      { content: item?.location?.region_name, align: "center" },
      { content: item?.properties?.port_details?.mac_address, align: "center" },
      { content: item?.revision_number, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created_at, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.floating_ip_address,
      item?.fixed_ip_address,
      item?.location?.region_name,
      item?.properties?.port_details?.mac_address,
      item?.revision_number,
      item?.status?.toUpperCase(),
      formatDate(item?.created_at, false, true, true),
    ];
  }, []);

  const reload = useCallback(fetchOpenstackFloatingIPs, [fetchOpenstackFloatingIPs]);

  const dataList = useDataList({
    data: openstackFloatingIPs?.list || [],
    columns,
    exportFilename: "Openstack FloatingIPs List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportOpenstackFloatingIPs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListOpenstackFloatingIPs;
