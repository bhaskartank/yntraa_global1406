import { useCallback } from "react";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListProtectionGroups from "components/templates/backup/ListProtectionGroups";

const ListProtectionGroupPolicyPage = () => {
  const dispatch = useDispatch();

  const fetchProtectionGroups = useCallback(
    (payload) => {
      dispatch(BackupRedux.actions.protectionGroups(payload));
    },
    [dispatch],
  );

  const exportProtectionGroups = useCallback(async () => {
    try {
      return await dispatch(BackupRedux.actions.exportprotectionGroups());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchProtectionGroupOwnerDetail = useCallback(
    (item) => {
      dispatch(BackupRedux.actions.computeProtectionGroupOwnerDetails({ providerId: item?.provider_id, protectionGroupId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Protection Groups Policy" breadcrumbs={[{ label: "Protection Groups Policy" }]}>
      <ListProtectionGroups
        fetchProtectionGroups={fetchProtectionGroups}
        exportProtectionGroups={exportProtectionGroups}
        fetchProtectionGroupOwnerDetail={fetchProtectionGroupOwnerDetail}
      />
      <ResourseOwnerDetail modalTitle="Protection Group Owner Details" />
    </PageContainer>
  );
};

export default ListProtectionGroupPolicyPage;
