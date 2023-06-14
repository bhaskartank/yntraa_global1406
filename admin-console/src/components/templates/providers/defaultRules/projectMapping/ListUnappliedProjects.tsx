import { Button, Stack, Typography } from "@mui/material";
import { UnappliedIcon } from "icons";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

interface ListUnappliedProjectProps {
  projects: any[];
  onSubmit: (payload: any) => void;
}

const ListUnappliedProjects: FC<ListUnappliedProjectProps> = ({ projects, onSubmit }) => {
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(() => [{ label: "Project Name" }, { label: "Description" }], []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.name }, { content: item?.description }], []);

  const dataList = useDataList({
    dataListKey: "unapplied-projects-default-rule",
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
          <UnappliedIcon />
          <Typography variant="h5" fontWeight="normal">
            Projects without this Rule ({projects?.length})
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
          Apply
        </Button>
      </Stack>
      <DataList dataList={dataList} />
    </Stack>
  );
};

export default ListUnappliedProjects;
