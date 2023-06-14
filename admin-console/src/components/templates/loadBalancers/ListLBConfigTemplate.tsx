import { Box, Card, CardContent, CircularProgress, Stack } from "@mui/material";
import { FC } from "react";
import { IoIosCloud } from "react-icons/io";

interface ListLBLogsProps {
  lbConfigTemplate: string;
}

const ListLBConsoleLogs: FC<ListLBLogsProps> = ({ lbConfigTemplate }) => {
  return (
    <Card sx={{ flex: 1, border: "1px solid black" }}>
      <CardContent sx={{ height: "100%", p: 0, ":last-child": { pb: 0 } }}>
        {lbConfigTemplate !== null ? (
          <Box sx={{ height: "100%", p: 2, pb: 4, background: "white", color: "black", overflowY: "auto" }}>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              <code>{lbConfigTemplate}</code>
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

export default ListLBConsoleLogs;
