import { Grid, Stack, Typography } from "@mui/material";

import { ComputeCardIcon, K8sCardIcon, NetworkCardIcon, ObjectStorageCardIcon, OrchestrationCardIcon, VolumeCardIcon } from "assets/icons";

import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: <ComputeCardIcon />,
    title: "Compute",
    description: "Spin up virtual machines in a few seconds. You can deploy your workloads and host your services or use these instances for development, testing etc.",
  },
  { icon: <VolumeCardIcon />, title: "Volume", description: "Attach storage to your instances, take backups and mitigate risks." },
  {
    icon: <NetworkCardIcon />,
    title: "Network",
    description:
      "Network is a virtual separation of resources. Resources in the same network can communicate with each other via private IP. To reach the resources from external/public networks, the resources must be mapped to public IP.",
  },
  {
    icon: <ObjectStorageCardIcon />,
    title: "Object Storage",
    description: "Store your files and other data as discrete units - objects. Organize your data in single or multiple buckets, create metadata and scale indefinitely.",
  },
  {
    icon: <K8sCardIcon />,
    title: "On Demand K8s",
    description: "Deploy on demand, manage, and maintain Kubernetes clusters. You get to choose the version, CNIs and dimensioning of the cluster.",
  },
  { icon: <OrchestrationCardIcon />, title: "Orchestration", description: "Spin up your applications in a ready to use manner. Get DB, instance etc at a single click." },
  { icon: <NetworkCardIcon />, title: "Load Balancer", description: "Distribute your traffic across a group of servers. Define distribution policy and manage auto-scaling." },
];

const CloudServices = () => {
  return (
    <Stack gap={1}>
      <Typography variant="h6">Cloud Services</Typography>

      <Grid container spacing={2}>
        {services?.map((service) => (
          <Grid key={service?.title} item xs={12} sm={6} md={4} lg={3}>
            <ServiceCard title={service?.title} description={service?.description} icon={service?.icon} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default CloudServices;
