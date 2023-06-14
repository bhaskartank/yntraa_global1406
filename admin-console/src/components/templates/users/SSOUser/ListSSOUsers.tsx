import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import usersRedux from "store/modules/users";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListSSOUsersProps {
  fetchSSOUsers: any;
  exportSSOUsers: any;
}

const ListSSOUsers: FC<ListSSOUsersProps> = ({ fetchSSOUsers, exportSSOUsers }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const SSOUsers = usersRedux.getters.SSOUsers(rootState);

  const columns: ColumnProps[] = useMemo(() => [{ label: "Username" }, { label: "Full Name" }, { label: "Mobile" }, { label: "Is Enabled", align: "center" }], []);

  const exportColumns: string[] = useMemo(() => ["Username", "Full Name", "Mobile", "Is Enabled"], []);

    const searchFields = useMemo(
      () => [
        { key: "username", label: "First Name, Last Name or Username" },
      ],
      [],
    );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.username },
      { content: `${item?.firstName} ${item?.middleName ? item?.middleName : ""} ${item?.lastName}`?.replaceAll("  ", " ") },
      { content: item?.attributes?.mobile_number },
      { content: item?.enabled !== null ? <StatusChip label={item?.enabled} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.username, `${item?.firstName} ${item?.middleName ? item?.middleName : ""} ${item?.lastName}`?.replaceAll("  ", " "), Number(item?.attributes?.mobile_number), item?.enabled];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSSOUsers({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchSSOUsers],
  );

  const dataList = useDataList({
    data: SSOUsers?.list || [],
    totalRecords: SSOUsers?.totalRecords,
    columns,
    exportFilename: "SSO Users List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportSSOUsers,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSSOUsers;
