import { useCallback } from "react";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListBackupPublicIPUpdate from "components/templates/backup/ListBackupPublicIPUpdate";

const ListBackupPublicIpUpdatePage = () => {
  const dispatch = useDispatch();

  const fetchBackupPublicIpUpdate = useCallback(
    (payload: any) => {
      dispatch(BackupRedux.actions.backupPublicIpUpdate(payload));
    },
    [dispatch],
  );

  const exportBackupPublicIpUpdate = useCallback(async () => {
    try {
      return await dispatch(BackupRedux.actions.exportbackupPublicIpUpdate());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  return (
    <PageContainer title="Backup Verification (Public IP Update Requests)" breadcrumbs={[{ label: "Public IP Update Requests" }]}>
      <ListBackupPublicIPUpdate fetchBackupPublicIpUpdate={fetchBackupPublicIpUpdate} exportBackupPublicIpUpdate={exportBackupPublicIpUpdate} />
    </PageContainer>
  );
};

export default ListBackupPublicIpUpdatePage;
