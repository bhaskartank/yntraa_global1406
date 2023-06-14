import { useCallback } from "react";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListBackupPublicIP from "components/templates/backup/ListBackupPublicIP";

const ListBackupPublicIpUpdatePage = () => {
  const dispatch = useDispatch();

  const fetchBackupPublicIp = useCallback(
    (payload: any) => {
      dispatch(BackupRedux.actions.backupPublicIp(payload));
    },
    [dispatch],
  );

  const exportBackupPublicIp = useCallback(async () => {
    try {
      return await dispatch(BackupRedux.actions.exportbackupPublicIp());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  return (
    <PageContainer title="Backup Verification (Public IP Requests)" breadcrumbs={[{ label: "Public IP Requests" }]}>
      <ListBackupPublicIP fetchBackupPublicIp={fetchBackupPublicIp} exportBackupPublicIp={exportBackupPublicIp} />
    </PageContainer>
  );
};

export default ListBackupPublicIpUpdatePage;
