import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BsDashLg } from "react-icons/bs";

import DateDisplay from "components/atoms/DateDisplay";

import { getAge } from "utils";

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
    <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`nic-tab-${index}`} style={{ ...containerStyle }} {...other}>
      <div style={{ height: "100%", padding: "16px", visibility: value === index ? "visible" : "hidden" }}>{children}</div>
    </div>
  );
}

const TABS = ["Basic Details"];

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface ItemProps {
  label: string;
  value: string | React.ReactNode;
}

const Item: FC<ItemProps> = ({ label, value }) => {
  return (
    <Stack direction="row" spacing={3}>
      <Typography fontWeight="bold" textAlign="right" color="neutral.600" sx={{ width: "140px", wordWrap: "break-word" }}>
        {label}
      </Typography>
      <Typography textAlign="left" color="neutral.600" sx={{ wordWrap: "break-word" }}>
        {value || <BsDashLg size={20} />}
      </Typography>
    </Stack>
  );
};

interface OverviewProps {
  volume: any;
}

const Overview: FC<OverviewProps> = ({ volume }) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ flexGrow: 1, bgColor: "background.paper", display: "flex", direction: { xs: "column", md: "row" } }}>
        <Tabs
          variant="scrollable"
          orientation="vertical"
          value={tab}
          onChange={handleTabChange}
          aria-label="Overview Tabs"
          sx={{ borderRight: 1, borderColor: "divider", overflowY: "auto" }}>
          {TABS.map((tab, key) => (
            <Tab
              key={key}
              label={tab}
              sx={{
                textTransform: "none",
                minWidth: { xs: "auto", md: "200px" },
                "&, & + &": { alignItems: "flex-start", ml: 0, mr: 2 },
              }}
              {...a11yProps(key)}
            />
          ))}
        </Tabs>

        <TabPanel value={tab} index={0} containerStyle={{ width: "100%" }}>
          <Stack spacing={1} width="100%">
            <Item label="Name" value={volume?.volume_name} />
            <Item label="Status" value={volume?.status} />
            <Item label="Power State" value={volume?.action} />
            <Item label="Created" value={volume?.created ? <DateDisplay datetime={volume?.created} /> : null} />
            <Item label="Updated" value={volume?.updated ? <DateDisplay datetime={volume?.updated} /> : null} />
            <Item label="Age" value={volume?.created ? getAge(volume?.created) : null} />
          </Stack>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Overview;
