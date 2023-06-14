import { Chip } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import ResourceName from "components/atoms/ResourceName";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListComputeAttachedSnapshotProps {
  fetchSnapshots: any;
  exportSnapshots: any;
}

const ListComputeAttachedSnapshots: FC<ListComputeAttachedSnapshotProps> = ({ fetchSnapshots, exportSnapshots }) => {
  const rootState = useSelector((state: any) => state);
  const snapshots = virtualMachinesRedux.getters.snapshots(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Description", align: "center" },
      { label: "Active", align: "center" },
      { label: "Image", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Description", "Active", "Image", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.snapshot_name} /> },
      { content: item?.snapshot_description, align: "center" },
      { content: <Chip size="small" label={item?.is_active ? "True" : "False"} color={item?.is_active ? "success" : "error"} />, align: "center" },
      { content: <Chip size="small" label={item?.is_image ? "True" : "False"} color={item?.is_image ? "success" : "error"} />, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.snapshot_name, item?.snapshot_description, item?.is_active ? "True" : "False", item?.is_image ? "True" : "False", formatDate(item?.created, false, true)];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSnapshots({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search, filters }),
    [fetchSnapshots],
  );

  const dataList = useDataList({
    data: snapshots?.list,
    totalRecords: snapshots?.totalRecords,
    columns,
    exportColumns,
    exportFilename: "Attached Snapshots List",
    rowCreator,
    exportCreator,
    listExporter: exportSnapshots,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListComputeAttachedSnapshots;
