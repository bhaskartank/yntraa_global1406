import { Divider, Stack } from "@mui/material";
import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "store";
import volumesRedux from "store/modules/volumes";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import UnitFilter from "components/atoms/UnitFilter";
import DataList from "components/organisms/DataList";
import { GridCreatorProps, RowActionProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ManageStorageProps {
  virtualMachine: any;
}

const ManageStorage = ({ virtualMachine }: ManageStorageProps) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const volumes = volumesRedux.getters.volumes(rootState);

  const isBootable = (item) => item?.bootable;
  const isAttached = (item) => item?.volume_attach_volume.length > 0;
  const isPerformingAction = (item) => !!item?.task_id;

  const handleFetchVolumes = useCallback(
    (payload) => {
      dispatch(volumesRedux.actions.volumes({ ...payload, compute_id: virtualMachine?.id }));
    },
    [dispatch, virtualMachine?.id],
  );

  const handleDetachVolume = useCallback(
    ({ compute_id, volumeId }) => {
      dispatch(volumesRedux.actions.detachVolume({ compute_id, volume_id: volumeId }, handleFetchVolumes));
    },
    [dispatch, handleFetchVolumes],
  );

  //   const handleFetchVolumeSnapshots = useCallback(
  //     async ({ volumeId }) => {
  //       try {
  //         return await dispatch(volumesRedux.actions.snapshots({ volume_id: volumeId }));
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     },
  //     [dispatch],
  //   );

  //   const handleDeleteVolumeSnapshot = useCallback(
  //     async (snapshotId, volumeId) => {
  //       try {
  //         await dispatch(snapshotsRedux.actions.deleteVolumeSnapshot({ snapshotId }));
  //         handleFetchVolumeSnapshots({ volumeId });
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     },
  //     [dispatch, handleFetchVolumeSnapshots],
  //   );

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
          <ResourceName label={item?.volume_name} />

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

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: () => "Detach Volume",
        onClick: (item) => handleDetachVolume({ compute_id: item?.volume_attach_volume[0].compute_id, volumeId: item?.id }),
        disabled: (item) => isPerformingAction(item),
        hidden: (item) => !(!isBootable(item) && isAttached(item)),
        confirmation: (item) => ({
          title: "Detaching Volume",
          description: `Are you sure you want to detach volume ${item?.volume_name}?`,
        }),
      },
      //   {
      //     label: () => "Manage Snapshot",
      //     onClick: (item) => null,
      //   },
    ],
    [handleDetachVolume],
  );

  const reload = useCallback(
    ({ page, size }) => {
      handleFetchVolumes({ offset: page * size, limit: size });
    },
    [handleFetchVolumes],
  );

  const dataList = useDataList({
    data: volumes?.list,
    totalRecords: volumes?.totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
    reload,
    rowActions,
  });

  return <DataList dataList={dataList} />;
};

export default ManageStorage;
