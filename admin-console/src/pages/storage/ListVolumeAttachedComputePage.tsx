import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import storageRedux from "store/modules/storage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListVolumeAttachedCompute from "components/templates/storage/ListVolumeAttachedCompute";
import VolumeDetailBar from "components/templates/storage/VolumeDetailBar";

const ListVolumeAttachedComputePage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { volume }: { volume: any } = routerState;

  const fetchComputes = useCallback(
    (payload) => {
      dispatch(storageRedux.actions.computes({ volumeId: volume?.id, providerId: volume?.provider_id }, payload));
    },
    [dispatch, volume],
  );

  const exportComputes = useCallback(async () => {
    try {
      return await dispatch(storageRedux.actions.exportComputes({ volumeId: volume?.id, providerId: volume?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, volume]);

  return (
    <PageContainer title="Attached Compute" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Attached Compute" }]}>
      <VolumeDetailBar volume={volume} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListVolumeAttachedCompute fetchComputes={fetchComputes} exportComputes={exportComputes} />
    </PageContainer>
  );
};

export default ListVolumeAttachedComputePage;
