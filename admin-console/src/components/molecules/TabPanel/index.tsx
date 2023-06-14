import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
  containerStyle?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, containerStyle, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`tab-${index}`} style={{ ...containerStyle }} {...other}>
      <div style={{ height: "100%", padding: "16px", visibility: value === index ? "visible" : "hidden" }}>{children}</div>
    </div>
  );
}

export default TabPanel;
