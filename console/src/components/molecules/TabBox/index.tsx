import { Box, Tab, Tabs } from "@mui/material";
import React, { FC, ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmptyData from "components/atoms/EmptyData";

interface TabPanelProps {
  children?: React.ReactNode;
  index?: number | string;
  value?: number | string;
  customStyle?: any;
}

const TabPanel: FC<TabPanelProps> = (props) => {
  const { children, value, index, customStyle = {}, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: "20px", border: "1px solid", borderColor: "grey.400", borderRadius: "8px", ...customStyle }}>{children}</Box>}
    </div>
  );
};

interface TabKeys {
  tabKey?: string;
  title: string;
  content: ReactNode;
}

interface TabBoxProps {
  tabs: TabKeys[];
  variant?: "contained" | "text";
  emptyDataText?: string;
  indexBased?: boolean;
}

const TabBox: FC<TabBoxProps> = ({ tabs, variant, emptyDataText, indexBased = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState<string | number>(0);

  const handleChange = (value: string | number) => {
    indexBased ? setValue(value) : navigate(String(value));
  };

  return (
    <Box width="100%">
      <Box sx={{ ...(variant === "contained" ? { mx: "20px" } : { borderBottom: 1, borderColor: "divider" }) }}>
        <Tabs variant="scrollable" value={indexBased ? value : location.pathname} onChange={(_, value) => handleChange(value)} sx={{ minHeight: "36px" }}>
          {tabs?.map((tab, index) => (
            <Tab
              key={index}
              label={tab?.title}
              {...(tab?.tabKey ? { value: tab?.tabKey } : {})}
              sx={{
                ...(variant === "contained"
                  ? {
                      border: `1px solid`,
                      borderColor: "grey.400",
                      borderRadius: "8px 8px 0 0",
                      marginLeft: "4px",
                      marginRight: "4px",
                      padding: "8px 16px",
                      minHeight: "36px",

                      "&.Mui-selected": {
                        backgroundColor: "grey.200",
                      },
                    }
                  : {}),
              }}
            />
          ))}
        </Tabs>
      </Box>
      {tabs?.map((tab, index) => (
        <TabPanel
          key={tab?.tabKey || tab?.title}
          {...(tab?.tabKey ? { index: tab?.tabKey, value: location.pathname } : { index, value })}
          customStyle={{ ...(variant === "contained" ? {} : { p: 0, border: 0, py: 2 }) }}>
          {tab?.content || <EmptyData text={emptyDataText} />}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabBox;
