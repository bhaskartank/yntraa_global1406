import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListUserProps {
  fetchUsers: any;
  exportUsers: any;
}

const ListUsers: FC<ListUserProps> = ({ fetchUsers, exportUsers }) => {
  const rootState = useSelector((state: any) => state);
  const organisationUsers = organisationsRedux.getters.organisationUsers(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Name" }, { label: "Username" }, { label: "Mobile No." }], []);

  const exportColumns: string[] = useMemo(() => ["Name", "Username", "Mobile No."], []);

  const searchFields = useMemo(() => [{ key: "email", label: "Email" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [{ content: `${item?.user?.first_name || ""} ${item?.user?.last_name || ""}` }, { content: item?.user?.username }, { content: item?.user?.mobile_no }],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [`${item?.user?.first_name || ""} ${item?.user?.last_name || ""}`, item?.user?.username, item?.user?.mobile_no];
  }, []);

  const reload = useCallback(({ limit, offset, search }) => fetchUsers({ limit, offset, search }), [fetchUsers]);

  const dataList = useDataList({
    data: organisationUsers?.list || [],
    totalRecords: organisationUsers?.totalRecords,
    columns,
    exportFilename: "Users List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportUsers,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListUsers;
