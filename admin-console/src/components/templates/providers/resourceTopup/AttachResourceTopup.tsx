import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import ControlledSelect from "components/molecules/ControlledSelect";

interface AttachResourceTopupProps {
  masterTopupQuota: any;
  attachResourceTopup: (items: number[]) => void;
}

const AttachResourceTopup: FC<AttachResourceTopupProps> = ({ masterTopupQuota, attachResourceTopup }) => {
  const rootState = useSelector((state: any) => state);
  const resourceTopup = providersRedux.getters.resourceTopup(rootState);

  const [selected, setSelected] = useState<any[]>([]);

  const topupSelectMapping = useMemo(() => {
    const attachedTopupIds = resourceTopup?.list?.map((topup) => topup?.resource_topup?.id);

    return masterTopupQuota?.list?.data
      ?.filter((topup) => !attachedTopupIds?.includes(topup?.id))
      ?.map((topup) => ({ label: `${topup?.topup_item}-${topup?.topup_type}-${topup?.topup_value}`, value: String(topup?.id) }));
  }, [masterTopupQuota, resourceTopup]);

  const handleSelect = useCallback((values) => {
    setSelected(values);
  }, []);

  const handleAttachTopup = useCallback(() => {
    attachResourceTopup(selected);
    setSelected([]);
  }, [selected, attachResourceTopup]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <ControlledSelect placeholder="Select Available Topup" value={selected} onChange={handleSelect} list={topupSelectMapping} multiple sx={{ width: "300px" }} />

      <Button variant="contained" color="primary" size="small" onClick={handleAttachTopup} disabled={!selected?.length}>
        Add Topup
      </Button>
    </Stack>
  );
};

export default AttachResourceTopup;
