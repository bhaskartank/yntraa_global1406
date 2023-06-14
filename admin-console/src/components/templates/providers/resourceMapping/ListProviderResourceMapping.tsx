import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListProviderResourceMappingProps {
  fetchProviderResourceMapping: any;
  exportProviderResourceMapping: any;
  handleDeleteProviderResourceMapping: (resourceImageFlavorId: number) => void;
}

const ListProviderResourceMapping: FC<ListProviderResourceMappingProps> = ({
  fetchProviderResourceMapping,
  exportProviderResourceMapping,
  handleDeleteProviderResourceMapping,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const providerProviderResourceMapping = providersRedux.getters.providerResourceMapping(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [{ label: "Resource Type" }, { label: "Resource Type Version", align: "center" }, { label: "Image Name" }, { label: "Flavor Name" }, { label: "Created" }],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Resource Type", "Resource Type Version", "Image Name", "Flavor Name", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_type },
      { content: item.resource_type_version, align: "center" },
      { content: item?.image?.name },
      { content: item?.flavor?.name },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.resource_type, item?.resource_type_version, item?.image?.name, item?.flavor?.name, formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Delete Mapping",
      confirmation: () => ({
        title: "Delete Mapping",
        description: "Are you sure you want to delete this mapping?",
      }),
      onClick: (item) => handleDeleteProviderResourceMapping(item?.id),
      color: "error.main",
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchProviderResourceMapping({ limit, offset }), [fetchProviderResourceMapping]);

  const dataList = useDataList({
    data: providerProviderResourceMapping?.list || [],
    totalRecords: providerProviderResourceMapping?.totalRecords,
    columns,
    actions,
    exportFilename: "Provider Resource Mapping List",
    exportColumns,
    createResourceButton: { text: "Add Resource Mapping", onClick: () => navigate("create") },
    rowCreator,
    exportCreator,
    listExporter: exportProviderResourceMapping,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProviderResourceMapping;
