import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import storageRedux from "store/modules/storage";

import ResourceName from "components/atoms/ResourceName";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListVolumeAttachedComputeProps {
  fetchComputes: any;
  exportComputes: any;
}

const ListVolumeAttachedCompute: FC<ListVolumeAttachedComputeProps> = ({ fetchComputes, exportComputes }) => {
  const rootState = useSelector((state: any) => state);
  const computes = storageRedux.getters.computes(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Compute Name" }, { label: "Private IP", align: "center" }, { label: "Volume Attachment Device", align: "center" }], []);

  const exportColumns: string[] = useMemo(() => ["Compute Name", "Private IP", "Volume Attachment Device"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.compute?.instance_name} /> },
      { content: item?.compute?.private_ip, align: "center" },
      { content: item?.volume_attachment_device_name, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.compute?.instance_name, item?.compute?.private_ip, item?.volume_attachment_device_name];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchComputes({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search, filters }),
    [fetchComputes],
  );

  const dataList = useDataList({
    data: computes?.list,
    totalRecords: computes?.totalRecords,
    columns,
    exportColumns,
    exportFilename: "Storage Attached Compute List",
    rowCreator,
    exportCreator,
    listExporter: exportComputes,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListVolumeAttachedCompute;
