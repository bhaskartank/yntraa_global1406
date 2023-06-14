import { useCallback } from "react";

import { useDispatch } from "store";
import storageRedux from "store/modules/storage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListBlockStorage from "components/templates/storage/ListBlockStorage";

const ListBlockStoragePage = () => {
  const dispatch = useDispatch();

  const fetchBlockStorage = useCallback(
    (payload) => {
      dispatch(storageRedux.actions.blockStorage(payload));
    },
    [dispatch],
  );

  const exportBlockStorage = useCallback(async () => {
    try {
      return await dispatch(storageRedux.actions.exportBlockStorage());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchBlockStorageOwnerDetail = useCallback(
    (item) => {
      dispatch(storageRedux.actions.fetchBlockStorageOwnerDetail({ providerId: item?.provider_id, volumeId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Block Storage" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Block Storage" }]}>
      <ListBlockStorage fetchBlockStorage={fetchBlockStorage} exportBlockStorage={exportBlockStorage} fetchBlockStorageOwnerDetail={fetchBlockStorageOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Block Storage Owner Details" />
    </PageContainer>
  );
};

export default ListBlockStoragePage;
