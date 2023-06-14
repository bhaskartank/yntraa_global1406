import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import projectsRedux from "store/modules/projects";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

const ListResources: FC = () => {
  const rootState = useSelector((state: any) => state);
  const projectResources = projectsRedux.getters.projectResources(rootState);

  const mappedData = useMemo(() => {
    const data = projectResources?.length ? projectResources[0]?.action_log[0] : null;

    if (data) {
      const resourceKeys = Object.keys(data);

      return resourceKeys?.map((resourceName) => ({
        name: resourceName,
        consumed: data[resourceName]?.consumed?.value?.toString(),
      }));
    }
    return [];
  }, [projectResources]);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Resource Name" }, { label: "Consumed" }], []);

  const exportColumns: string[] = useMemo(() => ["Resource Name", "Consumed"], []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.name }, { content: item?.consumed }], []);

  const dataList = useDataList({
    data: mappedData,
    columns,
    exportFilename: "Projects Resources List",
    exportColumns,
    rowCreator,
  });

  return <DataList dataList={dataList} />;
};

export default ListResources;
