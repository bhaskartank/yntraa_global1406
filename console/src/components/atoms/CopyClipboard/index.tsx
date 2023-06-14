import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";

import { CopyBtnIcon } from "assets/icons";

export interface CopyClipboardProps {
  copyText: string;
}

const CopyClipboard: FC<CopyClipboardProps> = ({ copyText }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator?.clipboard?.writeText(copyText);
      setIsCopied(true);
    } catch (err) {
      console.error(err);
    }
  };

  return copyText ? (
    <Tooltip title={isCopied ? "Copied!" : "Copy to Clipboard"} placement="top">
      <IconButton size="medium" onClick={handleCopy} sx={{ p: 0 }} onMouseLeave={() => setTimeout(() => setIsCopied(false), 300)}>
        <CopyBtnIcon />
      </IconButton>
    </Tooltip>
  ) : null;
};

export default CopyClipboard;
