import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListImageResourceMappingProps {
  fetchImageResourceMapping: any;
  exportImageResourceMapping: any;
  handleDeleteImageResourceMapping: (resourceImageMappingId: number) => void;
}

const ListImageResourceMapping: FC<ListImageResourceMappingProps> = ({ fetchImageResourceMapping, exportImageResourceMapping, handleDeleteImageResourceMapping }) => {
  const rootState = useSelector((state: any) => state);
  const imageResourceMapping = providersRedux.getters.imageResourceMapping(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Resource Type" }, { label: "Status", align: "center" }, { label: "Created" }, { label: "Updated" }], []);

  const exportColumns: string[] = useMemo(() => ["Resource Type", "Status", "Created", "Updated"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_type },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created) },
      { content: formatDate(item?.updated) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.resource_type, item?.status, formatDate(item?.created, false, true), formatDate(item?.updated, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Delete Mapping",
      confirmation: () => ({
        title: "Delete Mapping",
        description: "Are you sure you want to delete this mapping?",
      }),
      onClick: (item) => handleDeleteImageResourceMapping(item?.id),
      color: "error.main",
    },
  ];

  const reload = useCallback(fetchImageResourceMapping, [fetchImageResourceMapping]);

  const dataList = useDataList({
    data: imageResourceMapping || [],
    columns,
    actions,
    exportFilename: "Image Resource Mapping List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportImageResourceMapping,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListImageResourceMapping;
