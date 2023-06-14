import { FC, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListServiceProviderProps {
  fetchServiceProviders: any;
  exportServiceProviders: any;
}

const ListServiceProviders: FC<ListServiceProviderProps> = ({ fetchServiceProviders, exportServiceProviders }) => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const serviceProviders = providersRedux.getters.serviceProviders(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Description" },
      { label: "Configurable By" },
      { label: "Service Type" },
      { label: "Public", align: "center" },
      { label: "Active", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Description", "Configurable By", "Service Type", "Public", "Active", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.service_provider_name },
      { content: item?.service_provider_description },
      { content: item?.configurable_by },
      { content: item?.service_type?.name },
      { content: item?.is_public !== null ? <StatusChip label={item?.is_public} /> : null, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.service_provider_name,
      item?.service_provider_description,
      item?.configurable_by,
      item?.service_type?.name,
      item?.is_public,
      item?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Update Service Provider",
      onClick: (item) => navigate(`/providers/${providerId}/service-providers/${item?.id}/update`, { state: { serviceProvider: item } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchServiceProviders({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchServiceProviders],
  );

  const dataList = useDataList({
    data: serviceProviders?.list || [],
    columns,
    actions,
    exportFilename: "Service Providers List",
    exportColumns,
    createResourceButton: { text: "Create Service Provider", onClick: () => navigate("create") },
    rowCreator,
    exportCreator,
    listExporter: exportServiceProviders,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListServiceProviders;
