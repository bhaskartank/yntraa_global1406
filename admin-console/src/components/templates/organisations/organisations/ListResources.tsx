import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListResourceProps {
  fetchResources: any;
}

const ListResources: FC<ListResourceProps> = ({ fetchResources }) => {
  const rootState = useSelector((state: any) => state);
  const organisationResources = organisationsRedux.getters.organisationResources(rootState);

  const mappedData = useMemo(() => {
    if (organisationResources) {
      const data = organisationResources;
      const resourceKeys = Object.keys(data);

      return resourceKeys?.map((resourceName) => ({
        name: resourceName,
        base: data[resourceName]?.allocated?.quotapackage_breakup?.[0]?.base?.value?.toString(),
        topup: data[resourceName]?.allocated?.quotapackage_breakup?.[1]?.topup?.value?.toString(),
        allocated: data[resourceName]?.allocated?.value?.toString(),
        consumed: data[resourceName]?.consumed?.value?.toString(),
        total: data[resourceName]?.available?.value?.toString(),
      }));
    }
    return [];
  }, [organisationResources]);

  const columns: ColumnProps[] = useMemo(
    () => [{ label: "Resource Name" }, { label: "Base" }, { label: "Topup" }, { label: "Allocated" }, { label: "Consumed" }, { label: "Available" }],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Resource Name", "Base Quota", "Topup", "Allocated", "Consumed", "Available"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.base },
      { content: item?.topup },
      { content: item?.allocated },
      { content: item?.consumed },
      { content: item?.total },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.name, item?.base, item?.name, item?.topup, item?.total];
  }, []);

  const reload = useCallback(() => fetchResources(), [fetchResources]);

  const dataList = useDataList({
    data: mappedData,
    columns,
    exportFilename: "Resources List",
    exportColumns,
    rowCreator,
    exportCreator,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListResources;
