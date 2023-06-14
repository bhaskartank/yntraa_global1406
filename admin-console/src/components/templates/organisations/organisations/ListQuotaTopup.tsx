import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListQuotaTopupProps {
  fetchQuotaTopups: any;
}

const ListQuotaTopups: FC<ListQuotaTopupProps> = ({ fetchQuotaTopups }) => {
  const rootState = useSelector((state: any) => state);
  const organisationQuotaTopups = organisationsRedux.getters.organisationQuotaTopups(rootState);

  const mappedData = useMemo(() => {
    if (organisationQuotaTopups?.length) {
      const data = organisationQuotaTopups[0];
      const resourceKeys = Object.keys(data);

      return resourceKeys?.map((resourceName) => ({
        name: resourceName,
        base: data[resourceName]?.base?.toString(),
        topup: data[resourceName]?.topup?.toString(),
        total: data[resourceName]?.total?.toString(),
      }));
    }
    return [];
  }, [organisationQuotaTopups]);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Resource Name" }, { label: "Base Value" }, { label: "Topup Value" }, { label: "Total Value" }], []);

  const exportColumns: string[] = useMemo(() => ["Resource Name", "Base Value", "Topup Value", "Total Value"], []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.name }, { content: item?.base }, { content: item?.topup }, { content: item?.total }], []);

  const exportCreator = useCallback((item: any) => {
    return [item?.name, item?.base, item?.name, item?.topup, item?.total];
  }, []);

  const reload = useCallback(() => fetchQuotaTopups(), [fetchQuotaTopups]);

  const dataList = useDataList({
    data: mappedData,
    columns,
    exportFilename: "Quota Topups List",
    exportColumns,
    rowCreator,
    exportCreator,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListQuotaTopups;
