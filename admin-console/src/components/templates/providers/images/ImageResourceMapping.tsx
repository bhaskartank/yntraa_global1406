import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import ControlledSelect from "components/molecules/ControlledSelect";

interface ImageResourceMappingProps {
  onSubmit: (quotaPackageId: string) => void;
}

const ImageResourceMapping: FC<ImageResourceMappingProps> = ({ onSubmit }) => {
  const rootState = useSelector((state: any) => state);
  const imageResourceMapping = providersRedux.getters.imageResourceMapping(rootState);

  const [selected, setSelected] = useState<string>(null);

  const handleSelect = useCallback((quotaId) => {
    setSelected(String(quotaId));
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(selected);
    setSelected(null);
  }, [onSubmit, selected]);

  const resourceSelectMapping = useMemo(() => {
    const availableList = [
      { label: "NKS Controller", value: "nks_controller" },
      { label: "NKS Worker", value: "nks_worker" },
    ];

    const appliedList = imageResourceMapping?.map((resource) => resource?.resource_type);

    return availableList?.filter((item) => !appliedList?.includes(item?.value));
  }, [imageResourceMapping]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <ControlledSelect placeholder="Select Resource" value={selected} onChange={handleSelect} list={resourceSelectMapping} singleAsDefault={false} />
      </Stack>
      <Button variant="contained" color="primary" size="small" onClick={handleSubmit} disabled={!selected}>
        Map
      </Button>
    </Stack>
  );
};

export default ImageResourceMapping;
