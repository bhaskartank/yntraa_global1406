import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import { useSelector } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import ControlledSelect from "components/molecules/ControlledSelect";

interface ObjectStorageProviderAttachQuotaProps {
  availableQuota: any[];
  attachQuota: (quotaPackageId: string) => void;
}

const ObjectStorageProviderAttachQuota: FC<ObjectStorageProviderAttachQuotaProps> = ({ availableQuota, attachQuota }) => {
  const rootState = useSelector((state: any) => state);
  const attachedQuota = objectStorageRedux.getters.objectStorageProviderQuotaDetails(rootState);

  const [selectedQuota, setSelectedQuota] = useState<string>(null);

  const handleSelectQuota = useCallback((quotaId) => {
    setSelectedQuota(String(quotaId));
  }, []);

  const handleAttachQuota = useCallback(() => {
    attachQuota(selectedQuota);
    setSelectedQuota(null);
  }, [attachQuota, selectedQuota]);

  const quotaSelectMapping = useMemo(() => {
    const attachedQuotaIds = attachedQuota?.list?.map((quota) => quota?.quotapackage_id);

    return availableQuota?.filter((quota) => !attachedQuotaIds?.includes(quota?.id))?.map((quota) => ({ label: `${quota?.name}`, value: String(quota?.id) }));
  }, [attachedQuota, availableQuota]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ControlledSelect placeholder="Select Quota Package" value={selectedQuota} onChange={handleSelectQuota} list={quotaSelectMapping} singleAsDefault={false} />
      </Stack>
      <Button variant="contained" color="primary" size="small" onClick={handleAttachQuota} disabled={!selectedQuota}>
        Attach
      </Button>
    </Stack>
  );
};

export default ObjectStorageProviderAttachQuota;
