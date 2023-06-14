import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListResourceTopupProps {
  fetchResourceTopup: any;
  exportResourceTopup: any;
  detachResourceTopup: (resourceTopupId: number) => void;
}

const ListResourceTopup: FC<ListResourceTopupProps> = ({ fetchResourceTopup, exportResourceTopup, detachResourceTopup }) => {
  const rootState = useSelector((state: any) => state);
  const resourceTopup = providersRedux.getters.resourceTopup(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Topup Item" },
      { label: "Topup Type", align: "center" },
      { label: "Topup Value", align: "center" },
      { label: "Public", align: "center" },
      { label: "Active", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Provider ID", "Name", "Location", "Description", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_topup?.topup_item },
      { content: item?.resource_topup?.topup_type, align: "center" },
      { content: item?.resource_topup?.topup_value, align: "center" },
      { content: item?.resource_topup?.public !== null ? <StatusChip label={item?.resource_topup?.public} /> : null, align: "center" },
      { content: item?.resource_topup?.is_active !== null ? <StatusChip label={item?.resource_topup?.is_active} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.resource_topup?.topup_item, item?.resource_topup?.topup_type, item?.resource_topup?.topup_value, item?.resource_topup?.public, item?.resource_topup?.is_active];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Detach Quota Topup",
      confirmation: () => ({
        title: "Detach Quota Topup",
        description: "Are you sure you want to detach quota topup?",
      }),
      onClick: (item) => detachResourceTopup(item?.id),
      color: "error.main",
    },
  ];

    const reload = useCallback( 
    ({ limit, offset }) => fetchResourceTopup({ limit, offset }),
    [fetchResourceTopup])

  const dataList = useDataList({
    data: resourceTopup?.list || [],
    // totalRecords: resourceTopup?.totalRecords,
    columns,
    exportFilename: "Resource Topup List",
    exportColumns,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportResourceTopup,
    reload
  });

  return <DataList dataList={dataList} />;
};

export default ListResourceTopup;
