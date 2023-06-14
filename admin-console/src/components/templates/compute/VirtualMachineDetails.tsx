import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import { FC, useState } from "react";
import { BsDash } from "react-icons/bs";

import UnitFilter from "components/atoms/UnitFilter";
import TabPanel from "components/molecules/TabPanel";

import { getAge } from "utilities";
import { formatDate } from "utilities/comp";

const TABS = ["Basic Details", "Flavor", "Image", "Networks", "Security Groups", "Volumes Attached"];

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
      <Typography fontWeight="bold" textAlign="right" color="common.black" sx={{ width: "300px", wordWrap: "break-word" }}>
        {label}
      </Typography>
      <Typography textAlign="left" color="common.black" sx={{ wordWrap: "break-word" }}>
        {value || <BsDash size={20} />}
      </Typography>
    </Stack>
  );
};

interface VirtualMachineDetailsProps {
  compute: any;
}

const VirtualMachineDetails: FC<VirtualMachineDetailsProps> = ({ compute }) => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ mt: 1, mx: 2, height: "100%", overflowY: "auto", flexGrow: 1, bgColor: "background.paper", display: "flex", direction: { xs: "column", md: "row" } }}>
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
              color: "primary.main",
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
          <Item label="Name" value={compute?.instance_name} />
          <Item label="Cloud Reg. A/C No." value={compute?.project?.organisation?.org_reg_code} />
          <Item label="Organisation" value={compute ? `${compute?.project?.organisation?.name} (${compute?.project?.organisation?.org_id})` : null} />
          <Item label="Project" value={compute ? `${compute?.project?.name} (${compute?.project?.project_id})` : null} />
          <Item label="Provider" value={compute ? `${compute?.provider?.provider_name} (${compute?.provider?.provider_id})` : null} />
          <Item label="Provider Location" value={compute?.provider?.provider_location} />
          <Item label="Provider Instance ID" value={compute?.provider_instance_id} />
          <Item label="Status" value={compute?.status} />
          <Item label="Power State" value={compute?.action} />
          <Item label="Created" value={compute?.created ? formatDate(compute?.created, false) : null} />
          <Item label="Last Updated" value={compute?.updated ? formatDate(compute?.updated, false) : null} />
          <Item label="Age" value={compute?.created ? getAge(compute?.created) : null} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={1} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="Name" value={compute?.flavor?.name} />
          <Item label="RAM" value={<UnitFilter size={compute?.flavor?.ram} unit="GiB" flavorType="ram" />} />
          <Item label="Disk" value={<UnitFilter size={compute?.flavor?.disk} unit="GiB" flavorType="disk" />} />
          <Item label="VCPUs" value={compute?.flavor?.vcpus} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={2} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          <Item label="Name" value={compute?.image?.name} />
          <Item label="Description" value={compute?.image?.description} />
          <Item label="OS" value={compute?.image?.os} />
          <Item label="Architecture" value={compute?.image?.os_architecture} />
          <Item label="Version" value={compute?.image?.os_version} />
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={3} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          {compute?.compute_network_mapping?.map((network, key) => (
            <Stack key={network?.id}>
              <Item key={key} label={key ? "" : `Private IP${compute?.compute_network_mapping?.length > 1 ? "s" : ""}`} value={network ? `${network?.private_ip}` : null} />
            </Stack>
          ))}
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={4} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%" divider={<Divider flexItem orientation="horizontal" sx={{ py: 1 }} />}>
          {compute?.compute_security_group_mapping?.map((sg) => (
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
      <TabPanel value={tab} index={5} containerStyle={{ width: "100%", overflowY: "auto" }}>
        <Stack spacing={1} width="100%">
          {compute?.volume_attach_compute?.map((volume, key) => (
            <Stack key={volume?.id}>
              <Item key={key} label={key ? "" : "Attached To"} value={volume ? `${volume?.volume?.volume_name} on ${volume?.volume_attachment_device_name}` : null} />
            </Stack>
          ))}
        </Stack>
      </TabPanel>
    </Box>
  );
};

export default VirtualMachineDetails;
