import { combineReducers } from "@reduxjs/toolkit";

import { reducer as auth } from "store/modules/auth";
import { reducer as backups } from "store/modules/backups";
import { reducer as confirmModal } from "store/modules/confirmModal";
import { reducer as datalist } from "store/modules/datalist";
import { reducer as drawer } from "store/modules/drawer";
import { reducer as loadBalancers } from "store/modules/loadBalancers";
import { reducer as loader } from "store/modules/loader";
import { reducer as logs } from "store/modules/logs";
import { reducer as modals } from "store/modules/modals";
import { reducer as networks } from "store/modules/networks";
import { reducer as objectStorage } from "store/modules/objectStorage";
import { reducer as organisations } from "store/modules/organisations";
import { reducer as projects } from "store/modules/projects";
import { reducer as providers } from "store/modules/providers";
import { reducer as quotaPackages } from "store/modules/quotaPackages";
import { reducer as reports } from "store/modules/reports";
import { reducer as scalingGroups } from "store/modules/scalingGroups";
import { reducer as securityGroups } from "store/modules/securityGroups";
import { reducer as storage } from "store/modules/storage";
import { reducer as users } from "store/modules/users";
import { reducer as virtualMachines } from "store/modules/virtualMachines";

export const rootReducer = combineReducers({
  auth,
  confirmModal,
  datalist,
  drawer,
  loadBalancers,
  backups,
  loader,
  logs,
  networks,
  organisations,
  projects,
  providers,
  quotaPackages,
  reports,
  scalingGroups,
  securityGroups,
  storage,
  objectStorage,
  users,
  virtualMachines,
  modals,
});
