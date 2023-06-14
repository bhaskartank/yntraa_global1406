import { FC, useCallback, useMemo } from "react";
import { BsDashLg } from "react-icons/bs";

import { useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListComputeAttachedVolumeProps {
  fetchAttachedNetworks: any;
  exportAttachedNetworks: any;
}

const ListComputeAttachedNetworks: FC<ListComputeAttachedVolumeProps> = ({ fetchAttachedNetworks, exportAttachedNetworks }) => {
  const rootState = useSelector((state: any) => state);
  const { list } = virtualMachinesRedux.getters.networks(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Provider Network ID", align: "center" },
      { label: "Private IP", align: "center" },
      { label: "External", align: "center" },
      { label: "Status", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Provider Network ID", "Private IP", "External", "Status"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.network?.network_name} /> },
      { content: item?.network?.provider_network_id || <BsDashLg />, align: "center" },
      { content: item?.private_ip, align: "center" },
      { content: item?.network?.external ? <StatusChip label={item?.network?.external} /> : null, align: "center" },
      { content: item?.network?.status ? <StatusChip label={item?.network?.status} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.network?.network_name, item?.network?.provider_network_id, item?.private_ip, item?.network?.external, item?.network?.status];
  }, []);

  const reload = useCallback(fetchAttachedNetworks, [fetchAttachedNetworks]);

  const dataList = useDataList({
    data: list,
    columns,
    exportColumns,
    exportFilename: "Attached Networks List",
    rowCreator,
    exportCreator,
    listExporter: exportAttachedNetworks,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListComputeAttachedNetworks;
