import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import snapshotRedux from "store/modules/snapshots";
import volumeRedux from "store/modules/volumes";

import PageContainer from "components/layouts/Frame/PageContainer";
import TabBox from "components/molecules/TabBox";
import ListVolume from "components/templates/storage/ListVolume";
import ListVolumeSnapshot from "components/templates/storage/ListVolumeSnapshot";

import { pageTitles } from "utils/constants";

const ListStoragePage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const volumes = volumeRedux.getters.volumes(rootState);
  const volumeSnapshots = snapshotRedux.getters.volumeSnapshots(rootState);

  const fetchVolumes = useCallback(
    async (payload) => {
      dispatch(volumeRedux.actions.volumes(payload));
    },
    [dispatch],
  );

  const fetchVolumeSnapshots = useCallback(
    async (payload) => {
      dispatch(snapshotRedux.actions.volumeSnapshots(payload));
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_STORAGE}>
      <TabBox
        tabs={[
          {
            title: pageTitles?.PAGE_TITLE_STORAGE_LIST,
            content: <ListVolume list={volumes?.list} totalRecords={volumes?.totalRecords} fetchList={fetchVolumes} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_STORAGE_SNAPSHOT,
            content: <ListVolumeSnapshot list={volumeSnapshots?.list} totalRecords={volumeSnapshots?.totalRecords} fetchList={fetchVolumeSnapshots} />,
          },
          {
            title: pageTitles?.PAGE_TITLE_OSAAS_LIST,
            content: <></>,
          },
        ]}
      />
    </PageContainer>
  );
};

export default ListStoragePage;
