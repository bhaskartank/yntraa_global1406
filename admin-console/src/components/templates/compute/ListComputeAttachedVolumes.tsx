import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListComputeAttachedVolumeProps {
  fetchAttachedVolumes: any;
  exportAttachedVolumes: any;
}

const ListComputeAttachedVolumes: FC<ListComputeAttachedVolumeProps> = ({ fetchAttachedVolumes, exportAttachedVolumes }) => {
  const rootState = useSelector((state: any) => state);
  const { list } = virtualMachinesRedux.getters.volumes(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Size (GiB)", align: "center" },
      { label: "Attached Device Name", align: "center" },
      { label: "Bootable", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Size", "Attached Device Name", "Bootable", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.volume?.volume_name} /> },
      { content: item?.volume?.volume_size, align: "center" },
      { content: item?.volume_attachment_device_name, align: "center" },
      { content: item?.volume?.bootable?.toString() ? <StatusChip label={item?.volume?.bootable?.toString()} /> : null, align: "center" },
      { content: item?.volume?.status ? <StatusChip label={item?.volume?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.volume?.volume_name,
      item?.volume?.volume_size,
      item?.volume_attachment_device_name,
      item?.volume?.bootable ? "True" : "False",
      item?.volume?.status,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const reload = useCallback(fetchAttachedVolumes, [fetchAttachedVolumes]);

  const dataList = useDataList({
    data: list,
    columns,
    exportColumns,
    exportFilename: "Attached Volumes List",
    rowCreator,
    exportCreator,
    listExporter: exportAttachedVolumes,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListComputeAttachedVolumes;
