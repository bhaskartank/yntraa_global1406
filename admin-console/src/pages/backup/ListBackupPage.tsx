import { useCallback } from "react";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListBackup from "components/templates/backup/ListBackup";

const ListBackupPage = () => {
  const dispatch = useDispatch();

  const fetchBackups = useCallback(
    (payload) => {
      dispatch(BackupRedux.actions.backups(payload));
    },
    [dispatch],
  );

  const exportBackups = useCallback(async () => {
    try {
      return await dispatch(BackupRedux.actions.exportBackups());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchBackupsOwnerDetail = useCallback(
    (item) => {
      dispatch(BackupRedux.actions.computeBackupsOwnerDetails({ providerId: item?.provider_id, backupId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Backups" breadcrumbs={[{ label: "Backups" }]}>
      <ListBackup fetchBackups={fetchBackups} exportBackups={exportBackups} fetchBackupsOwnerDetail={fetchBackupsOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Backups Owner Details" />
    </PageContainer>
  );
};

export default ListBackupPage;
