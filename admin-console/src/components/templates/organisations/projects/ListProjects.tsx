import { Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import projectsRedux from "store/modules/projects";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListProjectProps {
  fetchProjects: any;
  exportProjects: any;
  fetchProjectOwnerDetail: any;
  defaultFilters: any;
}

const ListProjects: FC<ListProjectProps> = ({ fetchProjects, exportProjects, fetchProjectOwnerDetail, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const projects = projectsRedux.getters.projects(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Project Name", sortKey: "name", filterKey: "name", filters: projects?.list?.filter_values?.name },
      { label: "Project Code", sortKey: "project_id", align: "center", filterKey: "project_id", filters: projects?.list?.filter_values?.project_id },
      { label: "Project Description", sortKey: "description", align: "center" },
      { label: "Cloud Reg. A/C No.", align: "center" },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: projects?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      { label: "Created", sortKey: "created", align: "center", defaultSort: "desc" },
    ],
    [projects?.list],
  );

  const exportColumns: string[] = useMemo(
    () => ["Project Name", "Project Code", "Project Description", "Organisation Name", "Organisation Code", "Cloud Reg. A/C No.", "Created"],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "project_id", label: "Project ID" },
      { key: "organisation_org_reg_code", label: "Org, Reg. Code" },
      { key: "organisation_name", label: "Org. Name" },
      { key: "organisation_org_id", label: "Org. ID" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.project_id, align: "center" },
      { content: item?.description, align: "center" },
      { content: item?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack alignItems="center">
            <span>{item?.organisation?.name}</span>
            <span>({item?.organisation?.org_id})</span>
          </Stack>
        ),
        align: "center",
      },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.project_id,
      item?.description,
      item?.organisation?.org_reg_code,
      item?.organisation?.name,
      item?.organisation?.org_id,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { listProjectDetailState: item } }),
    },
    {
      label: () => "Project Provider Mapping",
      onClick: (item) => navigate(`${item?.organisation_id}/${item?.id}/providers`),
    },
    {
      label: () => "Project User Mapping",
      onClick: (item) => navigate(`${item?.id}/users`, { state: { project: item } }),
    },
    {
      label: () => "Project Owner Details",
      onClick: (item) => fetchProjectOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Project"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchProjects({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchProjects],
  );

  const dataList = useDataList({
    data: projects?.list?.data || [],
    totalRecords: projects?.totalRecords,
    columns,
    actions,
    exportFilename: "Projects List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportProjects,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProjects;
