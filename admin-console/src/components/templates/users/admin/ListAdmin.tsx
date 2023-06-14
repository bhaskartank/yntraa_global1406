import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import usersRedux from "store/modules/users";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListAdminProps {
  fetchAdmin: any;
  exportAdmin: any;
  resetPassword: (userId) => void;
  fetchUserDetails: any;
}

const ListAdmin: FC<ListAdminProps> = ({ fetchAdmin, exportAdmin, resetPassword, fetchUserDetails }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const admin = usersRedux.getters.admin(rootState);

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
      { content: `${item?.first_name} ${item?.middle_name} ${item?.last_name}`?.replaceAll("  ", " ") },
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
        description: "Are you sure you want to reset user's password",
      }),
      onClick: (item) => resetPassword(item?.id),
    },
    {
      label: () => "User Permissions Info (Admin Portal)",
      onClick: (item) => navigate(`/users/all-users/${item?.id}/admin-portal-permissions`, { state: { user: item } }),
    },
    {
      label: () => "User Permissions Info (Service Portal)",
      onClick: (item) => navigate(`/users/all-users/${item?.id}/service-portal-permissions`, { state: { user: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { user_name: [item?.username] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchAdmin({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchAdmin],
  );

  const dataList = useDataList({
    data: admin?.list?.data || [],
    totalRecords: admin?.totalRecords,
    columns,
    actions,
    exportFilename: "Admin List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportAdmin,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAdmin;
