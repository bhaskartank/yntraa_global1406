import { FC } from "react";

import Editor from "components/atoms/Editor";

interface InitScriptHistoryDetailProps {
  initScript: string;
}

const InitScriptHistoryDetail: FC<InitScriptHistoryDetailProps> = ({ initScript }) => {
  return <Editor value={atob(initScript)} />;
};

export default InitScriptHistoryDetail;
