import { combineReducers } from "@reduxjs/toolkit";

import { reducer as audit } from "store/modules/audit";
import { reducer as auth } from "store/modules/auth";
import { reducer as backups } from "store/modules/backups";
import { reducer as dataList } from "store/modules/datalist";
import { reducer as drawer } from "store/modules/drawer";
import { reducer as flavors } from "store/modules/flavors";
import { reducer as floatingIP } from "store/modules/floating-ips";
import { reducer as gateway } from "store/modules/gateway";
import { reducer as globalSearch } from "store/modules/global-search";
import { reducer as images } from "store/modules/images";
import { reducer as invoices } from "store/modules/invoices";
import { reducer as loadBalancers } from "store/modules/load-balancers";
import { reducer as loader } from "store/modules/loader";
import { reducer as modal } from "store/modules/modal";
import { reducer as networks } from "store/modules/networks";
import { reducer as objectStorage } from "store/modules/object-storage";
import { reducer as organisations } from "store/modules/organisations";
import { reducer as projects } from "store/modules/projects";
import { reducer as providers } from "store/modules/providers";
import { reducer as publicIPs } from "store/modules/public-ips";
import { reducer as quotaPackage } from "store/modules/quota-package";
import { reducer as resourceMetrices } from "store/modules/resource-metrics";
import { reducer as resourceStats } from "store/modules/resource-stats";
import { reducer as routers } from "store/modules/routers";
import { reducer as securityGroupRules } from "store/modules/security-group-rules";
import { reducer as securityGroups } from "store/modules/security-groups";
import { reducer as snapshots } from "store/modules/snapshots";
import { reducer as sockets } from "store/modules/sockets";
import { reducer as userRoles } from "store/modules/user-roles";
import { reducer as users } from "store/modules/users";
import { reducer as virtualMachines } from "store/modules/virtual-machines";
import { reducer as volumes } from "store/modules/volumes";

export const rootReducer = combineReducers({
  audit,
  auth,
  backups,
  dataList,
  drawer,
  flavors,
  floatingIP,
  gateway,
  globalSearch,
  images,
  invoices,
  loadBalancers,
  loader,
  modal,
  networks,
  objectStorage,
  organisations,
  projects,
  providers,
  publicIPs,
  quotaPackage,
  resourceMetrices,
  resourceStats,
  routers,
  securityGroupRules,
  securityGroups,
  snapshots,
  sockets,
  userRoles,
  users,
  virtualMachines,
  volumes,
});
