import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListAttachedQuotaProps {
  fetchAttachedQuota: any;
  exportAttachedQuota: any;
  detachQuota: (quotaPackageId: number) => void;
}

const ListAttachedQuota: FC<ListAttachedQuotaProps> = ({ fetchAttachedQuota, exportAttachedQuota, detachQuota }) => {
  const rootState = useSelector((state: any) => state);
  const attachedQuota = providersRedux.getters.attachedQuota(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Version", align: "center" },
      { label: "Description" },
      { label: "Quota Package Value" },
      { label: "Active", align: "center" },
      { label: "Created" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Version", "Description", "Quota Package Value", "Active", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.version, align: "center" },
      { content: item?.description },
      { content: item?.quotapackage_value },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.name, item?.version, item?.description, item?.quotapackage_value, item?.is_active, formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Detach Quota",
      confirmation: () => ({
        title: "Detach Quota",
        description: "Are you sure you want to detach this quota?",
      }),
      onClick: (item) => detachQuota(item?.id),
      color: "error.main",
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchAttachedQuota({ limit, offset }), [fetchAttachedQuota]);

  const dataList = useDataList({
    data: attachedQuota?.list || [],
    totalRecords: attachedQuota?.totalRecords,
    columns,
    exportFilename: "Attached Quota Package List",
    exportColumns,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportAttachedQuota,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAttachedQuota;
