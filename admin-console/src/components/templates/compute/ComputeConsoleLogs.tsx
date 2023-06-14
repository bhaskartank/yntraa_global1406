import { Box, Card, CardContent, CardHeader, CircularProgress, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { BsTerminal } from "react-icons/bs";
import { IoIosCloud } from "react-icons/io";

interface ComputeConsoleLogProps {
  consoleLog: string;
  compute: any;
}

const ComputeConsoleLogs: FC<ComputeConsoleLogProps> = ({ consoleLog, compute }) => {
  return (
    <Card sx={{ flex: 1, border: "1px solid black" }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent={"space-between"}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BsTerminal size={20} /> <Typography>Console Logs </Typography>
            </Stack>
          </Stack>
        }
        sx={{ background: "white", px: 2, py: 1, color: "black" }}
      />
      <CardContent sx={{ height: "100%", p: 0, ":last-child": { pb: 0 } }}>
        {consoleLog !== null ? (
          <Box sx={{ height: "100%", p: 2, pb: 4, background: "black", color: "white", overflowY: "auto" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              <code>{consoleLog}</code>
            </pre>
          </Box>
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

export default ComputeConsoleLogs;
