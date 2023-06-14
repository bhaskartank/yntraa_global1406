import { Box } from "@mui/material";
import { FC, useEffect } from "react";

import Editor from "components/molecules/Editor";

interface ConsoleLogsProps {
  consoleLogs: any;
  fetchConsoleLogs: () => any;
}

const ConsoleLogs: FC<ConsoleLogsProps> = ({ consoleLogs, fetchConsoleLogs }) => {
  useEffect(() => {
    fetchConsoleLogs();
  }, [fetchConsoleLogs]);

  return (
    <Box height="400px">
      <Editor value={consoleLogs?.console_log} />
    </Box>
  );
};

export default ConsoleLogs;
