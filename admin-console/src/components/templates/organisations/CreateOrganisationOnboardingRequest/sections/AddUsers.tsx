import { Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";
import DataField from "components/organisms/Form/DataField";

interface AddUserProps {
  formConfig: any;
  data: any[];
}

const AddUsers: FC<AddUserProps> = ({ formConfig, data }) => {
  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Username", sortKey: "username" },
      { label: "Full Name", sortKey: "first_name" },
      { label: "Mobile", sortKey: "mobile_no" },
      { label: "Active", align: "center" },
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

  const dataList = useDataList({
    data,
    columns,
    rowCreator,
    hideViewColumn: true,
  });

  return (
    <Stack gap={2}>
      <DataField name="user_details" formConfig={formConfig} />

      <DataList dataList={dataList} />
    </Stack>
  );
};

export default AddUsers;
