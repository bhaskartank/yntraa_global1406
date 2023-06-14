import { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListResourceUtilizationDetailProps {
  data: any;
}

const ListResourceUtilizationDetail: FC<ListResourceUtilizationDetailProps> = ({ data }) => {
  const mappedData = useMemo(() => {
    if (data) {
      const resourceKeys = Object.keys(data);

      return resourceKeys?.map((resourceName) => ({
        name: resourceName,
        allocated: data[resourceName]?.allocated?.value?.toString(),
        consumed: data[resourceName]?.consumed?.value?.toString(),
        available: data[resourceName]?.available?.value?.toString(),
      }));
    }
    return [];
  }, [data]);

  const columns: ColumnProps[] = useMemo(
    () => [{ label: "Resource Name" }, { label: "Allocated", align: "center" }, { label: "Consumed", align: "center" }, { label: "Available", align: "center" }],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Resource Name", "Allocated", "Consumed", "Available"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [{ content: item?.name }, { content: item?.allocated }, { content: item?.consumed }, { content: item?.available }],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.name, item?.allocated, item?.consumed, item?.available];
  }, []);

  const dataList = useDataList({
    data: mappedData,
    columns,
    exportFilename: "Resource Utilization Detail List",
    exportColumns,
    rowCreator,
    exportCreator,
  });

  return <DataList dataList={dataList} />;
};

export default ListResourceUtilizationDetail;
