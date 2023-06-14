import { Alert, Box, Button, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { MdOutlineInfo } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import CopyToClipboard from "components/atoms/CopyToClipboard";
import Editor from "components/atoms/Editor";
import ControlledSelect from "components/molecules/ControlledSelect";

import SampleScriptImage from "assets/images/cloud-init-sample.png";

import InitScriptVariablesModal from "./InitScriptVariables";
import SampleScriptText from "./SampleScript.json";

export const enum MODAL_TYPE {
  INIT_SCRIPT_VARIABLES = "INIT_SCRIPT_VARIABLES",
}

interface ManageInitScriptProps {
  image: any;
  fetchInitScript: any;
  addInitScript: any;
  updateInitScript: any;
  deleteInitScript: any;
}

const ManageInitScript: FC<ManageInitScriptProps> = ({ image, fetchInitScript, addInitScript, updateInitScript, deleteInitScript }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state) => state);
  const initScript = providersRedux.getters.initScript(rootState);
  const initScriptVariables = providersRedux.getters.initScriptVariables(rootState);

  const [script, setScript] = useState<string>("");
  const [isScriptExists, setIsScriptExists] = useState<boolean>(false);
  const [scriptType, setScriptType] = useState<string>("");
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => setActiveModal(null);

  const handleSelectScriptType = (type) => {
    setScript("#cloud-config");
    setScriptType(type);
  };

  const handleDeleteInitScript = () => {
    deleteInitScript(scriptType);
  };

  const scriptTypeSelectMapping = useMemo(() => {
    const filteredList = image?.image_resource_image_mapping?.filter((resource) => resource?.status?.toLowerCase() === "active");

    const scriptTypeSelectMappingOptions: { label: string; value: string }[] = filteredList?.map((resource) => ({
      label: resource?.resource_type,
      value: resource?.resource_type,
    }));

    scriptTypeSelectMappingOptions.push({ label: "system", value: "system" });

    return scriptTypeSelectMappingOptions;
  }, [image]);

  useEffect(() => {
    if (scriptType) {
      const scriptDetails = image?.init_script_images?.find((script) => script?.script_type === scriptType);
      if (scriptDetails) {
        // fetchInitScript(scriptType);
        setScript(atob(scriptDetails?.init_script));
        setIsScriptExists(true);
      }
    }
  }, [fetchInitScript, scriptType, image]);

  useEffect(() => {
    if (initScript) {
      const decodedScript = atob(initScript?.init_script);

      setScript(decodedScript);
    } else {
      setScript("#cloud-config");
    }
  }, [initScript]);

  useEffect(() => {
    if (scriptTypeSelectMapping?.length) {
      setScriptType(scriptTypeSelectMapping[0]?.value);
    }
  }, [scriptTypeSelectMapping]);

  return (
    <Stack justifyContent="space-between" overflow="auto" divider={<Divider flexItem />} sx={{ height: "100%", color: "common.black" }}>
      <Alert severity="warning">{`Note: '#cloud-config' is mandatory to start cloud init script. If there is no specific cloud init script for this template then please leave '#cloud-config' in first line and save to confirm.`}</Alert>
      <Stack direction="row" justifyContent="space-between" alignItems="center" p={1}>
        <ControlledSelect placeholder="Select Script Type" value={scriptType} onChange={handleSelectScriptType} list={scriptTypeSelectMapping} />
        <Button size="small" color="error" variant="contained" onClick={handleDeleteInitScript} disabled={!isScriptExists}>
          Delete Init Script
        </Button>
      </Stack>
      <Grid container sx={{ height: "100%", overflowY: "auto" }}>
        <Grid item xs={12} sm={7} sx={{ height: "100%" }}>
          <Editor value={script} onChange={(value) => setScript(value)} />
        </Grid>
        <Grid item xs={12} sm={5} sx={{ height: "100%" }}>
          <Stack sx={{ height: "100%", overflowY: "auto", p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography fontWeight="bold">Sample Cloud Init Script</Typography>
                <CopyToClipboard text={SampleScriptText?.value} />
              </Stack>
              <Tooltip title="Init Script Variables">
                <IconButton onClick={() => handleOpenModal(MODAL_TYPE.INIT_SCRIPT_VARIABLES)}>
                  <MdOutlineInfo size={20} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Box component="img" src={SampleScriptImage} alt="Sample Cloud Init Script" sx={{ width: "100%" }} />
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/images`)}>
          Cancel
        </Button>

        <Button variant="contained" color="info" fullWidth onClick={() => setScript("#cloud-config")}>
          Clear Script
        </Button>

        <Button
          variant="contained"
          fullWidth
          onClick={() => (isScriptExists ? updateInitScript({ initScript: btoa(script), scriptType }) : addInitScript({ initScript: btoa(script), scriptType }))}>
          {isScriptExists ? "Update" : "Add"} Script
        </Button>
      </Stack>

      <InitScriptVariablesModal isOpen={activeModal === MODAL_TYPE.INIT_SCRIPT_VARIABLES} onClose={handleCloseModal} variables={initScriptVariables?.list} />
    </Stack>
  );
};

export default ManageInitScript;
