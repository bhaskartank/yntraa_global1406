import { validateEnv } from "utils";

import { OverviewIcon } from "assets/icons";

const constants = {
  coredge: {
    APP_TITLE: "CCP UI",
    APP_DESCRIPTION: "CCP UI",
    FOOTER_TEXT: `© ${new Date().getFullYear()} Copyrights reserved.`,
  },
  yotta: {
    APP_TITLE: "Yntraa",
    APP_DESCRIPTION: "Yntraa",
    FOOTER_TEXT: `© ${new Date().getFullYear()} Copyrights reserved.`,
  },
};

const commonConstants = {
  pageTitles: {
    PAGE_TITLE_DASHBOARD: "Dashboard",

    PAGE_TITLE_PROJECT: "Projects",
    PAGE_TITLE_CREATE_PROJECT: "Create Project",

    PAGE_TITLE_QUOTA_PACKAGE: "Quota Packages",

    PAGE_TITLE_COMPUTE: "Compute",
    PAGE_TITLE_VIRTUAL_MACHINE_LIST: "Virtual Machines",
    PAGE_TITLE_VIRTUAL_MACHINE_DETAIL: "Virtual Machine",
    PAGE_TITLE_CREATE_VIRTUAL_MACHINE: "Create Virtual Machine",
    PAGE_TITLE_COMPUTE_SNAPSHOT: "Compute Snapshots",

    PAGE_TITLE_STORAGE: "Storage",
    PAGE_TITLE_STORAGE_LIST: "Volumes",
    PAGE_TITLE_VOLUME_DETAIL: "Volume",
    PAGE_TITLE_CREATE_VOLUME: "Create Volume",
    PAGE_TITLE_STORAGE_SNAPSHOT: "Volume Snapshots",
    PAGE_TITLE_OSAAS_LIST: "Object Storage",

    PAGE_TITLE_NETWORK: "Networking",
    PAGE_TITLE_NETWORK_LIST: "Networks",
    PAGE_TITLE_NETWORK_DETAIL: "Network",
    PAGE_TITLE_CREATE_NETWORK: "Create Network",
    PAGE_TITLE_SECURITY_GROUP_LIST: "Security Groups",
    PAGE_TITLE_SECURITY_GROUP_DETAIL: "Security Group",
    PAGE_TITLE_CREATE_SECURITY_GROUP: "Create Security Group",
    PAGE_TITLE_CREATE_SECURITY_RULE: "Create Security Rule",
    PAGE_TITLE_GATEWAY_LIST: "Gateway",
    PAGE_TITLE_LOAD_BALANCER_LIST: "Load Balancers",
    PAGE_TITLE_FLOATING_IP_LIST: "Floating IPs",
    PAGE_TITLE_PUBLIC_IP_LIST: "Public IPs",

    PAGE_TITLE_RESOURCE_UTILIZATION: "Resource Utilization",

    PAGE_TITLE_USER: "User Management",
    PAGE_TITLE_USER_LIST: "Users",
    PAGE_TITLE_USER_ROLE_LIST: "Roles",

    PAGE_TITLE_LOG: "Project Logs",

    PAGE_TITLE_REQUEST_RAISED: "Request Raised",
  },
  ui: {
    FOOTER_HEIGHT: 60,
    HEADER_HEIGHT: 60,
    LOGO_CONTAINER_HEIGHT: 80,
    DRAWER_WIDTH: 208,
    DRAWER_WIDTH_COLLAPSED: 54,
    SIDE_MENU_ITEM_HEIGHT: 40,
    SIDE_MENU_OFFSET: 8,
  },
  messages: {
    success: {},
    error: {},
  },
};

export const appRoutes = {
  LOGIN: "/login",
  AUTHENTICATE: "/authenticate",
  ONBOARDING: "/onboarding",

  DASHBOARD: "/",

  PROJECT: "/projects",
  CREATE_PROJECT: "/projects/create",

  QUOTA_PACKAGE: "/quota-packages",

  COMPUTE: "/compute",
  VIRTUAL_MACHINE_DETAIL: (virtualMachineId, section) => `/compute/${virtualMachineId}/${section}`,
  CREATE_VIRTUAL_MACHINE: "/compute/create",

  STORAGE: "/volumes",
  VOLUME_DETAIL: (volumeId, section) => `/volumes/${volumeId}/${section}`,
  CREATE_VOLUME: "/volumes/create",

  NETWORK: "/networks",
  NETWORK_DETAIL: (networkId, section) => `/networks/${networkId}/${section}`,
  CREATE_NETWORK: "/networks/create",
  SECURITY_GROUP_DETAIL: (networkId, section) => `/networks/security-groups/${networkId}/${section}`,
  CREATE_SECURITY_GROUP: "/networks/security-groups/create",
  CREATE_SECURITY_RULE: (securityGroupId) => `/networks/security-groups/${securityGroupId}/security-rules/create`,

  RESOURCE_UTILIZATION: "/resource-utilization",

  USER: "/users",

  LOGS: "/logs",

  REQUEST_RAISED: "/raise-request",
};

export const sidebarMenus = {
  DASHBOARD: { title: "Dashboard", path: appRoutes.DASHBOARD, icon: <OverviewIcon /> },
  PROJECT: { title: "Projects", path: appRoutes.PROJECT, icon: <OverviewIcon /> },
  QUOTA_PACKAGE: { title: "Quota Packages", path: appRoutes.QUOTA_PACKAGE, icon: <OverviewIcon /> },
  COMPUTE: { title: "Compute", path: appRoutes.COMPUTE, icon: <OverviewIcon /> },
  STORAGE: { title: "Storage", path: appRoutes.STORAGE, icon: <OverviewIcon /> },
  NETWORK: { title: "Networking", path: appRoutes.NETWORK, icon: <OverviewIcon /> },
  RESOURCE_UTILIZATION: { title: "Resource Utilization", path: appRoutes.RESOURCE_UTILIZATION, icon: <OverviewIcon /> },
  USER: { title: "User Management", path: appRoutes.USER, icon: <OverviewIcon /> },
  LOGS: { title: "Project Logs", path: appRoutes.LOGS, icon: <OverviewIcon /> },
  REQUEST_RAISED: { title: "Raise Request", path: appRoutes.REQUEST_RAISED, icon: <OverviewIcon /> },
};

let themeName;

if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
  themeName = "yotta";
} else {
  themeName = "coredge";
}

const themeConstants = constants[themeName];

export const { APP_TITLE, APP_DESCRIPTION, FOOTER_TEXT } = themeConstants;
export const { pageTitles, ui, messages } = commonConstants;
export const { FOOTER_HEIGHT, HEADER_HEIGHT, LOGO_CONTAINER_HEIGHT, DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, SIDE_MENU_ITEM_HEIGHT, SIDE_MENU_OFFSET } = ui;

// const resources = {
//   COMPUTE: {
//     PATH: "/compute",
//     TITLE: "Compute",
//     SECTION: {
//       VIRTUAL_MACHINE: {
//         LIST: {
//           PATH: "/compute/virtual-machines",
//           TITLE: "Virtual Machines",
//         },
//         CREATE: {
//           PATH: "/compute/virtual-machines/create",
//           TITLE: "Create Virtual Machine",
//         },
//         DETAIL: {
//           PATH: (virtualMachineId) => `/compute/virtual-machines/${virtualMachineId}`,
//           TITLE: "Create Virtual Machine",

//         }
//       },
//       COMPUTE_SNAPSHOT: {
//         LIST: {
//           PATH: "/compute/snapshots",
//           TITLE: "Compute Snapshots",
//         },
//       },
//     },
//   },
// };
