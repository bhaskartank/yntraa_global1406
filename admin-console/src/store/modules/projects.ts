import { createSlice } from "@reduxjs/toolkit";
import ProjectsApi from "observability/api/projects";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import { GLOBAL_RESET } from "./auth";

const name = "projects";
const initialState = {
  projects: { list: null, totalRecords: 0 },
  projectProviderMapping: [],
  projectUsers: { list: null, totalRecords: 0 },
  projectResources: [],
  securityGroupTypes: [],
  projectGatewayServices: [],
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setProjects(state, { payload }) {
      state.projects = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setProjectProviderMapping(state, { payload }) {
      state.projectProviderMapping = payload.data;
    },
    setProjectUsers(state, { payload }) {
      state.projectUsers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setProjectResources(state, { payload }) {
      state.projectResources = payload.data;
    },
    setSecurityGroupTypes(state, { payload }) {
      state.securityGroupTypes = payload.data;
    },
    setProjectGatewayServices(state, { payload }) {
      state.projectGatewayServices = payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GLOBAL_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  projects: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-projects", msg: "Loading Projects!" }));

    return ProjectsApi.projects(payload)
      .then((response) => {
        dispatch(slice.actions.setProjects(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-projects" }));
      });
  },
  exportProjects: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-projects", msg: "Exporting Projects List!" }));

    return ProjectsApi.projects()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-projects" }));
      });
  },
  computeProjectOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-project-owner-details", msg: "Loading Project Owner Details!" }));
    return ProjectsApi.computeProjectOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.name,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-project-owner-details" }));
      });
  },
  projectProviderMapping: (projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-project-provider-mapping", msg: "Loading Project and Provider Mapping!" }));

    return ProjectsApi.projectProviderMapping(projectId)
      .then((response) => {
        dispatch(slice.actions.setProjectProviderMapping(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-project-provider-mapping" }));
      });
  },
  projectUsers:
    (organisationId, projectId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-project-users", msg: "Loading Project Users!" }));

      return ProjectsApi.projectUsers(organisationId, projectId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setProjectUsers(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-project-users" }));
        });
    },
  exportProjectUsers: (organisationId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-project-users", msg: "Exporting Project Users List!" }));

    return ProjectsApi.projectUsers(organisationId, projectId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-project-users" }));
      });
  },
  attachUser: (organisationId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "attach-project-users", msg: "Attaching User to Project!" }));

    return ProjectsApi.attachUser(organisationId, projectId, payload)
      .then(() => {
        toast.success("User Attached to Project Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "attach-project-users" }));
      });
  },
  detachUser: (organisationId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "detach-project-users", msg: "Detaching User from Project!" }));

    return ProjectsApi.detachUser(organisationId, projectId, payload)
      .then(() => {
        toast.success("User Detached from Project Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "detach-project-users" }));
      });
  },
  createGateway: (providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-gateway", msg: "Creating Project Gateway!" }));

    return ProjectsApi.createGateway(providerId, projectId)
      .then(() => {
        toast.success("Project Gateway Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-gateway" }));
      });
  },
  deleteGateway: (providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-gateway", msg: "Deleting Project Gateway!" }));

    return ProjectsApi.deleteGateway(providerId, projectId)
      .then(() => {
        toast.success("Project Gateway Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-gateway" }));
      });
  },
  deleteProject: (providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-project", msg: "Deleting Project!" }));

    return ProjectsApi.deleteProject(providerId, projectId)
      .then(() => {
        toast.success("Project Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-project" }));
      });
  },
  projectResources:
    (providerId, projectId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-project-resources", msg: "Loading Project Resources!" }));

      return ProjectsApi.projectResources(providerId, projectId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setProjectResources(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-project-resources" }));
        });
    },
  createSecurityGroupByType: (providerId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-sg-by-type", msg: "Creating Security Group By Type!" }));

    return ProjectsApi.createSecurityGroupByType(providerId, projectId, payload)
      .then(() => {
        toast.success("Security Group by Type Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-sg-by-type" }));
      });
  },
  securityGroupTypes: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-security-group-types", msg: "Loading Security Group Types!" }));

    return ProjectsApi.securityGroupTypes()
      .then((response) => {
        dispatch(slice.actions.setSecurityGroupTypes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-security-group-types" }));
      });
  },
  applyDefaultRule: (providerId, projectId, resourceType) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "apply-default-rule-project", msg: "Applying Default Rule on Project!" }));

    return ProjectsApi.applyDefaultRule(providerId, projectId, resourceType)
      .then(() => {
        toast.success("Default Rule Applied on Project Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "apply-default-rule-project" }));
      });
  },
  projectGatewayServices: (providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-project-gateway-services", msg: "Loading Project Gateway Services!" }));

    return ProjectsApi.projectGatewayServices(providerId, projectId)
      .then((response) => {
        dispatch(slice.actions.setProjectGatewayServices(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-project-gateway-services" }));
      });
  },
  updatedProjectGatewayServicesStatus: (providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-list-project-gateway-services", msg: "Loading Latest Project Gateway Services!" }));

    return ProjectsApi.updatedProjectGatewayServicesStatus(providerId, projectId)
      .then((response) => {
        dispatch(slice.actions.setProjectGatewayServices(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-list-project-gateway-services" }));
      });
  },
  createProjectGatewayService: (providerId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-project-gateway-service", msg: "Creating Project Gateway Service!" }));

    return ProjectsApi.createProjectGatewayService(providerId, projectId, payload)
      .then(() => {
        toast.success("Project Gateway Service Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-project-gateway-service" }));
      });
  },
  projectGatewayServiceAction: (providerId, projectId, serviceId, action) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "perform-action-project-gateway-service", msg: "Performing Action on Project Gateway Service!" }));

    return ProjectsApi.projectGatewayServiceAction(providerId, projectId, serviceId, action)
      .then(() => {
        toast.success("Action Completed Successfully on Project Gateway Service!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "perform-action-project-gateway-service" }));
      });
  },
  reInitProject: (providerId, projectId, orgId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "perform-action-project-gateway-service", msg: "Performing Action on Project Gateway Service!" }));

    return ProjectsApi.reInitProject(providerId, projectId, orgId)
      .then(() => {
        toast.success("Action Completed Successfully on Project Gateway Service!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "perform-action-project-gateway-service" }));
      });
  },
};

const getters = {
  projects(rootState) {
    const state = rootState[name];
    return state.projects;
  },
  projectById(rootState, projectId) {
    const state = rootState[name];
    return state.projects?.list?.data?.find((project) => project?.id?.toString() === projectId?.toString());
  },
  projectProviderMapping(rootState) {
    const state = rootState[name];
    return state.projectProviderMapping;
  },
  projectUsers(rootState) {
    const state = rootState[name];
    return state.projectUsers;
  },
  projectResources(rootState) {
    const state = rootState[name];
    return state.projectResources;
  },
  securityGroupTypes(rootState) {
    const state = rootState[name];
    return state.securityGroupTypes;
  },
  projectGatewayServices(rootState) {
    const state = rootState[name];
    return state.projectGatewayServices;
  },
};

export default {
  actions,
  getters,
  slice,
};
