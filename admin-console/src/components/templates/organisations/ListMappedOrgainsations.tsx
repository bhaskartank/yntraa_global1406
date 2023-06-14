import { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListMappedOrganisationsProps {
  fetchMappedOrganisations: any;
  exportMappedOrganisations: any;
  mappedOrganisations?: any;
}

const ListMappedOrganisations: FC<ListMappedOrganisationsProps> = ({ fetchMappedOrganisations, exportMappedOrganisations, mappedOrganisations }) => {
  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Cloud Reg. A/C No.", sortKey: "org_reg_code", filterKey: "organisation_org_reg_code", filters: mappedOrganisations?.list?.filter_values?.org_reg_code },
      { label: "Org ID", align: "center", sortKey: "org_id", filterKey: "org_id", filters: mappedOrganisations?.list?.filter_values?.org_id },
      { label: "Name", align: "center", sortKey: "name" },
      { label: "Description", align: "center", sortKey: "description" },
      { label: "Onboarded On", sortKey: "created", align: "center", defaultSort: "desc" },
    ],
    [mappedOrganisations?.list],
  );

  const exportColumns: string[] = useMemo(() => ["Cloud Reg. A/C No.", "Org ID", "Name", "Description", "Onboarded On"], []);

  const searchFields = useMemo(
    () => [
      { key: "org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "org_id", label: "Org ID" },
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.org_reg_code },
      { content: item?.org_id, align: "center" },
      { content: item?.name, align: "center" },
      { content: item?.description, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.org_reg_code, item?.org_id, item?.name, item?.description, formatDate(item?.created, false, true)];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchMappedOrganisations({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchMappedOrganisations],
  );

  const dataList = useDataList({
    data: mappedOrganisations?.list?.data || [],
    totalRecords: mappedOrganisations?.totalRecords,
    columns,
    exportFilename: "Mapped Organisations List",
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
