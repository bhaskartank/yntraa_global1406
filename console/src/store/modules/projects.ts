import { createSlice } from "@reduxjs/toolkit";
import find from "lodash/find";
import some from "lodash/some";
import { toast } from "react-toastify";

import { store } from "store";

import projectApis from "api/projects";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";
import socketsRedux from "./sockets";

const name = "projects";

const initialState = {
  projects: [],
  projectById: null,
  projectUsers: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setProjects(state, { payload }) {
      state.projects = payload;
    },
    setProjectById(state, { payload }) {
      state.projectById = payload;
    },
    setProjectUsers(state, { payload }) {
      state.projectUsers = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(THE_GREAT_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  initializeProject: (payload) => async (dispatch) => {
    try {
      dispatch(loaderRedux.actions.addMessage({ type: "subscribe-project", msg: "Subscribing Project!" }));
      await projectApis.initializeProject(payload);

      dispatch(loaderRedux.actions.removeMessage({ type: "subscribe-project" }));
    } catch (err) {
      dispatch(loaderRedux.actions.removeMessage({ type: "subscribe-project" }));
      console.error(err);
      throw Error(err);
    }
  },
  projects:
    ({ organisationId = null, payload = { limit: 100 } }: { organisationId?: any; payload?: any }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();

        if (!organisationId) {
          organisationId = authRedux.getters.selectedOrganisationId(rootState);
        }

        const response = await projectApis.projects(organisationId, payload);

        dispatch(slice.actions.setProjects(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  projectById:
    ({ organisationId, projectId }) =>
    async (dispatch, getState) => {
      try {
        if (!organisationId) {
          const rootState = getState();
          organisationId = authRedux.getters.selectedOrganisationId(rootState);
        }

        const response = await projectApis.projectById(organisationId, projectId);

        dispatch(slice.actions.setProjectById(response?.data));

        return response?.data;
      } catch (err) {
        console.error(err);
      }
    },
  projectUsers:
    ({ organisationId, projectId, payload = {} }) =>
    async (dispatch, getState) => {
      try {
        if (!projectId) {
          const state = getState();
          projectId = authRedux.getters.selectedProjectId(state.auth);
        }

        const response = await projectApis.projectUsers(organisationId, projectId, payload);

        dispatch(slice.actions.setProjectUsers(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  detachProjectUsers:
    ({ organisationId, projectId, payload }) =>
    async (dispatch, getState) => {
      try {
        if (!projectId) {
          const state = getState();
          projectId = authRedux.getters.selectedProjectId(state.auth);
        }

        await projectApis.detachProjectUser(organisationId, projectId, payload);

        toast.success("User Detached from Project Successfully");
      } catch (err) {
        console.error(err);
      }
    },
  attachProjectUsers:
    ({ organisationId, projectId, payload }) =>
    async (dispatch, getState) => {
      try {
        if (!projectId) {
          const state = getState();
          projectId = authRedux.getters.selectedProjectId(state.auth);
        }

        await projectApis.attachProjectUser(organisationId, projectId, payload);

        toast.success("User Attached to Project Successfully");
      } catch (err) {
        console.error(err);
      }
    },
  createProject: (payload) => async (dispatch, getState) => {
    try {
      const state = getState();
      const organisationId = authRedux.getters.selectedProjectId(state);

      await projectApis.createProject(organisationId, payload);

      toast.success("Project Created Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  deleteProject: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      await projectApis.deleteProject(organisationId, payload.projectId);

      toast.success("Project Deleted Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  mapProvider:
    (payload, handleRefreshList = null) =>
    async (dispatch) => {
      try {
        const response = await projectApis.initProvider(payload.organisation_id, payload.provider_id, payload.project_id, payload);

        dispatch(
          socketsRedux.actions.executeSocketStatus({
            taskId: response?.data?.task_id,
            callback: () => (handleRefreshList ? handleRefreshList() : dispatch(actions.projects({}))),
            successMsg: "Initialized Project On Provider Successfully",
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  projects(rootState) {
    const state = rootState[name];
    return state.projects;
  },
  projectById(rootState) {
    const state = rootState[name];
    return (organisationId, projectId) => {
      if (!projectId) {
        return Promise.reject(new Error("No project Id Provided"));
      }
      if (some(state.projects, { id: projectId })) {
        return Promise.resolve(find(state.projects, { id: projectId }));
      } else {
        // trigger update and cache the result
        // TODO: need to check
        // return store.dispatch('projects/details', { 'organisationId': organisationId, 'projectId': projectId })
        return store.dispatch(actions.projectById({ organisationId, projectId }));
      }
    };
  },
  projectUsers(rootState) {
    const state = rootState[name];
    return state.projectUsers;
  },
};

export default {
  slice,
  actions,
  getters,
};
