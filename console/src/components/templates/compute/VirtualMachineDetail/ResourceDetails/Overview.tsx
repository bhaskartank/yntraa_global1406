import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BsDashLg } from "react-icons/bs";

import DateDisplay from "components/atoms/DateDisplay";
import UnitFilter from "components/atoms/UnitFilter";

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

const TABS = ["Basic Details", "Flavor", "Operating System", "IP Addresses", "Security Groups", "Volumes Attached"];

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
  virtualMachine: any;
}

const Overview: FC<OverviewProps> = ({ virtualMachine }) => {
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
            <Item label="Name" value={virtualMachine?.instance_name} />
            <Item label="Project" value={virtualMachine?.project?.name} />
            <Item label="Provider" value={virtualMachine ? `${virtualMachine?.provider?.provider_name} (${virtualMachine?.provider?.provider_location})` : null} />
            <Item label="Status" value={virtualMachine?.status} />
            <Item label="Power State" value={virtualMachine?.action} />
            <Item label="Created" value={virtualMachine?.created ? <DateDisplay datetime={virtualMachine?.created} /> : null} />
            <Item label="Updated" value={virtualMachine?.updated ? <DateDisplay datetime={virtualMachine?.updated} /> : null} />
            <Item label="Age" value={virtualMachine?.created ? getAge(virtualMachine?.created) : null} />
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={1} containerStyle={{ width: "100%" }}>
          <Stack spacing={1} width="100%">
            <Item label="Name" value={virtualMachine?.flavor?.name} />
            <Item label="RAM" value={<UnitFilter size={virtualMachine?.flavor?.ram} unit="GiB" flavorType="ram" valueFontWeight="normal" />} />
            <Item label="Disk" value={<UnitFilter size={virtualMachine?.flavor?.disk} unit="GiB" flavorType="disk" valueFontWeight="normal" />} />
            <Item label="VCPUs" value={virtualMachine?.flavor?.vcpus} />
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={2} containerStyle={{ width: "100%" }}>
          <Stack spacing={1} width="100%">
            <Item label="Name" value={virtualMachine?.image?.name} />
            <Item label="OS" value={virtualMachine?.image?.os} />
            <Item label="Architecture" value={virtualMachine?.image?.os_architecture} />
            <Item label="Version" value={virtualMachine?.image?.os_version} />
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={3} containerStyle={{ width: "100%" }}>
          <Stack spacing={1} width="100%">
            {virtualMachine?.compute_network_mapping?.map((network, key) => (
              <Stack key={network?.id}>
                <Item
                  key={key}
                  label={key ? "" : `Private IP${virtualMachine?.compute_network_mapping?.length > 1 ? "s" : ""}`}
                  value={network ? `${network?.private_ip}` : null}
                />
              </Stack>
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={4} containerStyle={{ width: "100%", overflowY: "auto" }}>
          <Stack spacing={1} width="100%">
            {virtualMachine?.compute_security_group_mapping?.map((sg) => (
              <Stack key={sg?.id}>
                {sg?.security_group?.security_group_rule_security_group
                  ?.filter((rule) => rule?.status?.toLowerCase() === "active")
                  ?.map((rule, key) => (
                    <Item
                      key={rule?.id}
                      label={key ? "" : sg?.security_group?.security_group_name}
                      value={rule ? `ALLOW ${rule?.ethertype} ${rule?.protocol} ${rule?.direction === "ingress" ? "to" : "from"} ${rule?.remote_ip_prefix}` : null}
                    />
                  ))}
              </Stack>
            ))}
          </Stack>
        </TabPanel>
        <TabPanel value={tab} index={5} containerStyle={{ width: "100%" }}>
          <Stack spacing={1} width="100%">
            {virtualMachine?.volume_attach_compute?.map((volume, key) => (
              <Stack key={volume?.id}>
                <Item key={key} label={key ? "" : "Attached To"} value={volume ? `${volume?.volume?.volume_name} on ${volume?.volume_attachment_device_name}` : null} />
              </Stack>
            ))}
          </Stack>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Overview;
