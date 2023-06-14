import { Button, Stack, Typography } from "@mui/material";
import { AppliedIcon } from "icons";
import { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListAppliedProjectProps {
  projects: any[];
  onSubmit: (payload: any) => void;
}

const ListAppliedProjects: FC<ListAppliedProjectProps> = ({ projects, onSubmit }) => {
  const columns: ColumnProps[] = useMemo(() => [{ label: "Project Name" }, { label: "Description" }], []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.name }, { content: item?.description }], []);

  const dataList = useDataList({
    dataListKey: "applied-projects-default-rule",
    data: projects,
    columns,
    hideViewColumn: true,
    checkbox: true,
    rowCreator,
  });

  return (
    <Stack sx={{ color: "#000", flex: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <AppliedIcon />
          <Typography variant="h5" fontWeight="normal">
            Projects with this Rule ({projects?.length})
          </Typography>
        </Stack>

        <Button
          size="small"
          variant="contained"
          disabled={!dataList?.checkedRows?.length}
          onClick={() => {
            onSubmit(dataList?.checkedRows);
            dataList?.handleClearAllCheckedRows();
          }}>
          Remove
        </Button>
      </Stack>

      <DataList dataList={dataList} />
    </Stack>
  );
};

export default ListAppliedProjects;
