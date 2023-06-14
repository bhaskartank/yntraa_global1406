import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListMappedOrganisationProps {
  fetchMappedOrganisations: any;
  exportMappedOrganisations: any;
}

const ListMappedOrganisations: FC<ListMappedOrganisationProps> = ({ fetchMappedOrganisations, exportMappedOrganisations }) => {
  const rootState = useSelector((state: any) => state);
  const quotaMappedOrganisation = providersRedux.getters.quotaMappedOrganisation(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Cloud Reg. A/C No.", sortKey: "org_reg_code" },
      { label: "Organisation Code", sortKey: "org_id" },
      { label: "Name", sortKey: "name" },
      { label: "Description", sortKey: "description" },
      { label: "Onboarded On", sortKey: "created", defaultSort: "desc" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Cloud Reg. A/C No.", "Organisation Code", "Name", "Description", "Onboarded On"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.org_reg_code },
      { content: item?.org_id, align: "center" },
      { content: item?.name },
      { content: item?.description },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.org_reg_code, item?.org_id, item?.name, item?.description, formatDate(item?.created)];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "org_id", label: "Organisation Code" },
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
    ],
    [],
  );

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy }) => fetchMappedOrganisations({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search }),
    [fetchMappedOrganisations],
  );

  const dataList = useDataList({
    data: quotaMappedOrganisation?.list || [],
    totalRecords: quotaMappedOrganisation?.totalRecords,
    columns,
    exportFilename: "Mapped Organisation List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportMappedOrganisations,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListMappedOrganisations;
