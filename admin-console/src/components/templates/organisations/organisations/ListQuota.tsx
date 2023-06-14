import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListQuotaProps {
  fetchQuotas: any;
  exportQuotas: any;
}

const ListQuotas: FC<ListQuotaProps> = ({ fetchQuotas, exportQuotas }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const organisationQuotas = organisationsRedux.getters.organisationQuotas(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Version" },
      { label: "Description" },
      { label: "Value" },
      { label: "Provider Name" },
      { label: "Provider Location" },
      { label: "Allocated On" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Version", "Description", "Value", "Provider Name", "Provider Location", "Allocated On"], []);

  const searchFields = useMemo(() => [{ key: "name", label: "Name" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.quotapackage?.name },
      { content: item?.quotapackage?.version },
      { content: item?.quotapackage?.description },
      { content: item?.quotapackage?.quotapackage_value },
      { content: item?.provider?.provider_name },
      { content: item?.provider?.provider_location },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.quotapackage?.name,
      item?.quotapackage?.version,
      item?.quotapackage?.description,
      item?.quotapackage?.quotapackage_value,
      item?.provider?.provider_name,
      item?.provider?.provider_location,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Quota Topup Details",
      onClick: (item) => navigate(`${item?.id}/topup`, { state: { quota: item } }),
    },
    {
      label: () => "Resource Details",
      onClick: (item) => navigate(`${item?.id}/resources`, { state: { quota: item } }),
    },
  ];

  const reload = useCallback(({ limit, offset, search }) => fetchQuotas({ limit, offset, search }), [fetchQuotas]);

  const dataList = useDataList({
    data: organisationQuotas?.list || [],
    totalRecords: organisationQuotas?.totalRecords,
    columns,
    exportFilename: "Organisation Quota List",
    exportColumns,
    searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportQuotas,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListQuotas;
