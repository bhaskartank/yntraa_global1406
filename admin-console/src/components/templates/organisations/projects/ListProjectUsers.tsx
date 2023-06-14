import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import projectsRedux from "store/modules/projects";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListProjectUserProps {
  fetchProjectUsers: any;
  exportProjectUsers: any;
  detachUser: (userId: number) => void;
}

const ListProjectUsers: FC<ListProjectUserProps> = ({ fetchProjectUsers, exportProjectUsers, detachUser }) => {
  const rootState = useSelector((state: any) => state);
  const projectUsers = projectsRedux.getters.projectUsers(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Name" }, { label: "Email" }, { label: "Assigned Role" }, { label: "Mapped On" }], []);

  const exportColumns: string[] = useMemo(() => ["Name", "Email", "Assigned Role", "Mapped On"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: `${item?.user?.first_name || ""} ${item?.user?.middle_name || ""} ${item?.user?.last_name || ""}` },
      { content: item?.user?.email },
      { content: item?.role_permission_group?.group_name },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      `${item?.user?.first_name || ""} ${item?.user?.middle_name || ""} ${item?.user?.last_name || ""}`,
      item?.user?.email,
      item?.role_permission_group?.group_name,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Detach User",
      confirmation: () => ({
        title: "Detach User",
        description: "Are you sure you want to detach this user?",
      }),
      onClick: (item) => detachUser(item?.user?.id),
      color: "error.main",
    },
  ];

  const reload = useCallback(({ limit, offset }) => fetchProjectUsers({ limit, offset }), [fetchProjectUsers]);

  const dataList = useDataList({
    data: projectUsers?.list || [],
    totalRecords: projectUsers?.totalRecords,
    columns,
    actions,
    exportFilename: "Project Users List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportProjectUsers,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProjectUsers;
