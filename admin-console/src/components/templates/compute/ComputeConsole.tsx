import { Card, CardContent, CardHeader, CircularProgress, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { BsTerminal } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";
import { IoIosCloud } from "react-icons/io";

interface ComputeConsoleProps {
  consoleURL: string;
}

const ComputeConsole: FC<ComputeConsoleProps> = ({ consoleURL }) => {
  return (
    <Card sx={{ border: "1px solid black", display: "flex", flexDirection: "column", overflowY: "auto", height: "100%", p: 0 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent={"space-between"}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BsTerminal size={20} /> <Typography>Server Console </Typography>
            </Stack>
            {consoleURL ? (
              <Tooltip title="Open in new tab" placement="top">
                <IconButton sx={{ p: 0 }} onClick={() => window.open(consoleURL, "_blank")}>
                  <HiOutlineExternalLink />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        }
        sx={{ background: "white", px: 2, py: 1, color: "black" }}
      />
      <CardContent sx={{ overflowY: "auto", height: "798px", flex: 1, p: 0, ":last-child": { pb: 0 } }}>
        {consoleURL ? (
          <iframe src={consoleURL} height="798px" width="100%" />
        ) : (
          <Stack alignItems="center" justifyContent="center" sx={{ background: "black", height: "100%" }}>
            <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", zIndex: 4 }}>
              <IoIosCloud size={100} color="white" />
            </Stack>
            <Stack alignItems="center" justifyContent="center" sx={{ zIndex: 5, pt: 1 }}>
              <CircularProgress color={"inherit"} size={30} />
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ComputeConsole;
