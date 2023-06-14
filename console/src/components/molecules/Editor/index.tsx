import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-terminal";
import { FC } from "react";
import AceEditor from "react-ace";

interface ManageInitScriptProps {
  value: string;
  onChange?: (value: string) => void;
}

const Editor: FC<ManageInitScriptProps> = ({ value, onChange }) => {
  const options = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 2,
  };

  const editorProps = { $blockScrolling: true };

  return (
    <AceEditor
      mode="yaml"
      theme="terminal"
      value={value}
      onChange={onChange}
      readOnly={!onChange}
      editorProps={editorProps}
      fontSize={14}
      setOptions={options}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
    />
  );
};

export default Editor;
