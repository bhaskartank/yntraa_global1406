import { Box } from "@mui/material";

import { useSelector } from "store";
import { getters } from "store/modules/loader";

import loaderCloud from "./loader-cloud.svg";

const Loader = () => {
  const state = useSelector((state: any) => state) || {};
  const isLoading = getters.isLoading(state);
  const loadingMsg = getters.loadingMsg(state);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        left: "0",
        top: "0",
        zIndex: 100,
        display: "flex",
        right: "0",
        bottom: "0",
        ".loader-content": {
          width: "200px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          img: { maxWidth: "100px" },
          span: { display: "block", color: "common.white", margin: "10px 0 0", textAlign: "center" },
        },
      }}>
      <Box className="loader-content">
        <img src={loaderCloud} />
        <Box component={"span"} sx={{ backgroundColor: "rgba(0, 0, 0, 0.4)", px: 4, py: 2 }}>
          {loadingMsg}
        </Box>
      </Box>
    </Box>
  );
};

export default Loader;
