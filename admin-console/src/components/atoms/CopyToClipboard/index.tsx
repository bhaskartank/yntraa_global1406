import { IconButton, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { BsCheck2 } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";

export interface CopyToClipboardProps {
  text: string;
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({ text }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator?.clipboard?.writeText(text);
      setIsCopied(true);

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Tooltip title={isCopied ? "Copied!" : "Copy to Clipboard"} placement="top">
      <IconButton color={isCopied ? "success" : "primary"} onClick={handleCopy} sx={{ p: 0 }}>
        {isCopied ? <BsCheck2 size={16} /> : <FaRegCopy size={16} />}
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboard;
