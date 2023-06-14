import { sidebarMenus } from "utils/constants";

export const menus = [
  {
    heading: "",
    items: [sidebarMenus.DASHBOARD, sidebarMenus.QUOTA_PACKAGE],
  },
  {
    heading: "Resources",
    items: [sidebarMenus.COMPUTE, sidebarMenus.STORAGE, sidebarMenus.NETWORK, sidebarMenus.RESOURCE_UTILIZATION],
  },
  {
    heading: "Access",
    items: [sidebarMenus.USER, sidebarMenus.PROJECT, sidebarMenus.LOGS],
  },
  {
    heading: "",
    items: [sidebarMenus.REQUEST_RAISED],
  },
];
