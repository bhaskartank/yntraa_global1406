import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import usersRedux from "store/modules/users";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListUserProps {
  fetchUsers: any;
  exportUsers: any;
  resetPassword: (userId: number) => void;
  handleSyncUser: (userId: number) => void;
  blockUser: (userId: number) => void;
  unblockUser: (userId: number) => void;
  fetchUserDetails: any;
}

const ListUsers: FC<ListUserProps> = ({ fetchUsers, exportUsers, resetPassword, fetchUserDetails, handleSyncUser, blockUser, unblockUser }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const users = usersRedux.getters.users(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Username", sortKey: "username" },
      { label: "Full Name", sortKey: "first_name" },
      { label: "Mobile", sortKey: "mobile_no" },
      { label: "Active", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Username", "Full Name", "Mobile", "Active"], []);

  const searchFields = useMemo(
    () => [
      { key: "username", label: "Username" },
      { key: "first_name", label: "First Name" },
      { key: "middle_name", label: "Middle Name" },
      { key: "last_name", label: "Last Name" },
      { key: "email", label: "Email ID" },
      { key: "mobile_no", label: "Mobile No." },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.username },
      { content: `${item?.first_name} ${item?.middle_name} ${item?.last_name}`?.trim().replaceAll("  ", " ") },
      { content: item?.mobile_no },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.username, `${item?.first_name} ${item?.middle_name} ${item?.last_name}`?.replaceAll("  ", " "), item?.mobile_no, item?.is_active];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => fetchUserDetails(item?.id),
    },
    {
      label: () => "Reset Password",
      confirmation: () => ({
        title: "Reset Password",
        description: "Are you sure you want to reset user's password?",
      }),
      onClick: (item) => resetPassword(item?.id),
    },
    // {
    //   label: () => "Synchronize User with SSO",
    //   onClick: (item) => handleSyncUser(item?.id),
    // },
    {
      label: () => "Block User",
      confirmation: (item) => ({
        title: "Block User",
        detailDescription: (
          <>
            Are you sure you want to block <b>{item?.username}</b>?
          </>
        ),
      }),
      onClick: (item) => blockUser(item?.id),
      hidden: (item) => item?.status?.toLowerCase() === "blocked",
    },
    {
      label: () => "Unblock User",
      confirmation: (item) => ({
        title: "Unblock User",
        detailDescription: (
          <>
            Are you sure you want to unblock <b>{item?.username}</b>?
          </>
        ),
      }),
      onClick: (item) => unblockUser(item?.id),
      hidden: (item) => item?.status?.toLowerCase() === "unblocked" || item?.status === null,
    },
    {
      label: () => "User Permissions Info (Admin Portal)",
      onClick: (item) => navigate(`${item?.id}/admin-portal-permissions`, { state: { user: item } }),
    },
    {
      label: () => "User Permissions Info (Service Portal)",
      onClick: (item) => navigate(`${item?.id}/service-portal-permissions`, { state: { user: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { user_name: [item?.username] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchUsers({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchUsers],
  );

  const dataList = useDataList({
    data: users?.list?.data || [],
    totalRecords: users?.totalRecords,
    columns,
    actions,
    exportFilename: "Users List",
    exportColumns,
    searchFields,
    createResourceButton: { text: "Create User", onClick: () => navigate("create") },
    rowCreator,
    exportCreator,
    listExporter: exportUsers,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListUsers;
