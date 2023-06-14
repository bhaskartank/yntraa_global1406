import { Divider, Stack } from "@mui/material";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import UnitFilter from "components/atoms/UnitFilter";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes, pageTitles } from "utils/constants";

interface ListVolumeProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListVolume: FC<ListVolumeProps> = ({ list, totalRecords, fetchList }) => {
  const navigate = useNavigate();

  const getState = (action) => {
    const prop: { label?: string } = { label: "attached" };

    if (action) {
      switch (action?.toLowerCase()) {
        case "error":
          prop.label = "creation error";
          break;
        default:
          prop.label = action;
      }
    }

    return <StatusChip label={prop.label} />;
  };

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: (
        <Stack gap="4px">
          <ResourceName label={item?.volume_name} onClick={() => navigate(appRoutes.VOLUME_DETAIL(item?.id, "overview"))} />

          <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
            <UnitFilter size={item?.volume_size} unit="GiB" flavorType="disk" variant="filled" />

            {item?.resource_annotations?.length ? (
              <TagList
                tags={item?.resource_annotations?.map((resource) => `${resource?.annotation_key} ${resource?.annotation_value ? `:` + " " + resource?.annotation_value : ""}`)}
              />
            ) : null}
          </Stack>
        </Stack>
      ),
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={<StatusChip label={item?.status} />} />
            <KeyValuePair label="State" value={getState(item?.action)} />
          </GridViewSection>
          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [],
  );

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
    reload,
    createResourceButton: {
      text: pageTitles.PAGE_TITLE_CREATE_VOLUME,
      onClick: () => navigate(appRoutes.CREATE_VOLUME),
    },
  });

  return <DataList dataList={dataList} />;
};

export default ListVolume;
