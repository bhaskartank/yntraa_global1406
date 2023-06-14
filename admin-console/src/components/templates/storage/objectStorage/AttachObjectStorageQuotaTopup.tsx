import { Button, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import objectStorageRedux from "store/modules/objectStorage";

import ControlledSelect from "components/molecules/ControlledSelect";

interface selectType {
  type: string | null;
  value: number | string | null;
  typeList: any[];
  valueList: any[];
  topupDetails: any;
}

const initialTopUpSelectedValue: selectType = {
  type: "",
  value: null,
  typeList: [],
  valueList: [],
  topupDetails: "",
};

interface AttachObjectStorageTopupProps {
  handleAttachResourceTopup: any;
}

const AttachObjectStorageTopup: FC<AttachObjectStorageTopupProps> = ({ handleAttachResourceTopup }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageResourceTopups = objectStorageRedux.getters.objectStorageResourceTopups(rootState);
  const objectStorageQuotaTopups = objectStorageRedux.getters.objectStorageQuotaTopups(rootState);
  const [selectValue, setSelectValue] = useState<selectType>(initialTopUpSelectedValue);

  const handleSelectTypeChange = (value) => {
    setSelectValue({ ...selectValue, type: value });
  };

  const handleSelectValueChange = (value) => {
    setSelectValue({ ...selectValue, value: Number(value) });
  };

  useMemo(() => {
    const topupMap = new Map();
    objectStorageResourceTopups?.list?.data?.forEach((item) => {
      if (!topupMap.has(item?.resource_name))
        topupMap.set(item?.resource_name, [
          {
            label: item?.resource_name?.toLowerCase() === "object_storage" ? `${item?.topup_value} GiB` : item?.topup_value,
            value: String(item?.id),
          },
        ]);
      else {
        const value = topupMap.get(item?.resource_name);
        topupMap.set(item?.resource_name, [
          ...value,
          {
            label: item?.resource_name?.toLowerCase() === "object_storage" ? `${item?.topup_value} GiB` : item?.topup_value,
            value: String(item?.id),
          },
        ]);
      }
    });
    const topupLabel = [];
    topupMap.forEach((values, keys) => {
      topupLabel.push({ label: keys?.split("_").join(" "), value: keys });
    });

    setSelectValue({ ...selectValue, typeList: topupLabel, topupDetails: topupMap });
  }, [objectStorageResourceTopups, objectStorageQuotaTopups]);

  useMemo(() => {
    if (selectValue?.type) {
      selectValue?.topupDetails?.forEach((value, key) => {
        if (key === selectValue?.type) setSelectValue({ ...selectValue, value: 0, valueList: value });
      });
    }
  }, [selectValue?.type]);

  const onSubmit = useCallback(async () => {
    await handleAttachResourceTopup({ resource_topup_id: selectValue?.value });
    setSelectValue({ type: "", value: "", typeList: [], valueList: [], topupDetails: "" });
  }, [handleAttachResourceTopup, selectValue]);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <ControlledSelect placeholder="Select Topup Type" value={selectValue?.type} onChange={handleSelectTypeChange} list={selectValue?.typeList} />
        <ControlledSelect
          placeholder="Select Topup Value"
          value={selectValue?.type ? String(selectValue?.value) : ""}
          onChange={handleSelectValueChange}
          list={selectValue?.valueList}
        />
      </Stack>

      <Button variant="contained" color="primary" size="small" onClick={onSubmit} disabled={!selectValue?.value || !selectValue?.type}>
        Attack Resource Topup
      </Button>
    </Stack>
  );
};

export default AttachObjectStorageTopup;
