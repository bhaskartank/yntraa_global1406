import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BsDash } from "react-icons/bs";

import TabPanel from "components/molecules/TabPanel";

import { formatDate } from "utilities/comp";

const TABS = ["Basic Details", "Organisation Details", "Project Details", "Provider Details"];

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
      <Typography fontWeight="bold" textAlign="right" color="common.black" sx={{ width: "160px", wordWrap: "break-word" }}>
        {label}
      </Typography>
      <Typography textAlign="left" color="common.black" sx={{ wordWrap: "break-word" }}>
        {value || <BsDash size={20} />}
      </Typography>
    </Stack>
  );
};

interface ActionLogDetailsProps {
  actionLog: any;
}

const ActionLogDetails: FC<ActionLogDetailsProps> = ({ actionLog }) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ mx: 2, height: "100%", overflowY: "auto", flexGrow: 1, bgColor: "background.paper", display: "flex", direction: { xs: "column", md: "row" } }}>
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
              minWidth: { xs: "auto", md: "160px" },
              "&, & + &": { alignItems: "flex-start", ml: 0, mr: 2 },
              "&.MuiTab-root.Mui-selected": {
                bgcolor: "primary.light",
                width: "100%",
              },
            }}
            {...a11yProps(key)}
          />
        ))}
      </Tabs>

      <TabPanel value={tab} index={0} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="User Name" value={actionLog?.user_name} />
          <Item label="Action" value={actionLog?.action} />
          <Item label="Action Method" value={actionLog?.action_method} />
          <Item label="Resource Name" value={actionLog?.resource_name} />
          <Item label="Resource Type" value={actionLog?.resource_type} />
          <Item label="Resource ID" value={actionLog?.resource_id} />
          <Item label="Status" value={actionLog?.status} />
          <Item label="Log Date" value={actionLog?.created ? formatDate(actionLog?.created, false) : null} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={1} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="Cloud Reg. A/C No." value={actionLog?.organisation?.org_reg_code} />
          <Item label="Name" value={actionLog?.organisation?.name} />
          <Item label="Code" value={actionLog?.organisation?.org_id} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={2} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="Name" value={actionLog?.project?.name} />
          <Item label="Code" value={actionLog?.project?.project_id} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={3} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="Name" value={actionLog?.provider?.provider_name} />
          <Item label="Code" value={actionLog?.provider?.provider_id} />
          <Item label="Location" value={actionLog?.provider?.provider_location} />
        </Stack>
      </TabPanel>
    </Box>
  );
};

export default ActionLogDetails;
