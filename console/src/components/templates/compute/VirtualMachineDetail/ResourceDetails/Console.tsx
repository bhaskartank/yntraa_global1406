import { FC, useEffect } from "react";

interface ConsoleURLProps {
  consoleURL: any;
  fetchConsoleURL: () => any;
}

const ConsoleURL: FC<ConsoleURLProps> = ({ consoleURL, fetchConsoleURL }) => {
  useEffect(() => {
    fetchConsoleURL();
  }, [fetchConsoleURL]);

  return <iframe src={consoleURL?.console_url} height="798px" width="100%" />;
};

export default ConsoleURL;
