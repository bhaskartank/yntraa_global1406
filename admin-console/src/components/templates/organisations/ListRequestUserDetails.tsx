import { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListRequestUserDetailsProps {
  users: any[];
  fetchUserDetails: any;
  resetPassword: any;
}

const ListRequestUserDetails: FC<ListRequestUserDetailsProps> = ({ users, fetchUserDetails, resetPassword }) => {
  const columns: ColumnProps[] = useMemo(() => [{ label: "Name" }, { label: "Email" }, { label: "Mobile No." }, { label: "New/Existing" }], []);

  const exportColumns: string[] = useMemo(() => ["Name", "Email", "Mobile No.", "New/Existing"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: `${item?.first_name || ""} ${item?.last_name || ""}` },
      { content: item?.email },
      { content: item?.mobile_no },
      { content: item?.is_existing_user?.exists ? "Existing" : "New" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [`${item?.first_name || ""} ${item?.last_name || ""}`, item?.email, item?.mobile_no];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => fetchUserDetails(item),
      hidden: (item) => item?.is_existing_user?.exists === false,
    },
    {
      label: () => "Reset Password",
      confirmation: () => ({
        title: "Reset Password",
        description: "Are you sure you want to reset user's password?",
      }),
      onClick: (item) => resetPassword(item?.is_existing_user?.user_id),
      hidden: (item) => item?.is_existing_user?.exists === false,
    },
  ];

  const dataList = useDataList({
    data: users,
    columns,
    exportFilename: "User Details List",
    exportColumns,
    rowCreator,
    exportCreator,
    actions,
  });

  return <DataList dataList={dataList} />;
};

export default ListRequestUserDetails;
