import { createSlice } from "@reduxjs/toolkit";
import organisationsApi from "observability/api/organisations";
import { toast } from "react-toastify";

import { apiHeaderTotalCount } from "utilities";

import authRedux, { GLOBAL_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "organisations";
const initialState = {
  totalRecords: 0,
  organisations: { list: [], totalRecords: 0 },
  organisationRequests: { list: [], totalRecords: 0 },
  organisationChangeRequests: { list: [], totalRecords: 0 },
  onboardingRequestUserDetails: [],
  onboardingChangeRequestUserDetails: [],
  organisationUsers: { list: [], totalRecords: 0 },
  organisationQuotas: { list: [], totalRecords: 0 },
  organisationQuotaTopups: [],
  organisationResources: [],
  organisationImages: { list: [], totalRecords: 0 },
  organisationFlavors: { list: [], totalRecords: 0 },
  organisationZones: { list: [], totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setOrganisations(state, { payload }) {
      state.organisations = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationOnboardingRequests(state, { payload }) {
      state.organisationRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationOnboardingChangeRequests(state, { payload }) {
      state.organisationChangeRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOnboardingRequestUserDetails(state, { payload }) {
      state.onboardingRequestUserDetails = payload.data;
    },
    setOnboardingChangeRequestUserDetails(state, { payload }) {
      state.onboardingChangeRequestUserDetails = payload.data;
    },
    setOrganisationUsers(state, { payload }) {
      state.organisationUsers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationQuotas(state, { payload }) {
      state.organisationQuotas = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationQuotaTopups(state, { payload }) {
      state.organisationQuotaTopups = payload.data;
    },
    setOrganisationResources(state, { payload }) {
      state.organisationResources = payload.data;
    },
    setOrganisationImages(state, { payload }) {
      state.organisationImages = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationFlavors(state, { payload }) {
      state.organisationFlavors = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOrganisationZones(state, { payload }) {
      state.organisationZones = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  organisations:
    (payload = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-organisation", msg: "Loading Organisations!" }));

      return organisationsApi
        .organisations(payload)
        .then((response) => {
          dispatch(slice.actions.setOrganisations(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation" }));
        });
    },
  exportOrganisations: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisations", msg: "Exporting Organisations List!" }));

    return organisationsApi
      .organisations({})
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisations" }));
      });
  },
  organisationOnboardingRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-org-onboarding-requests", msg: "Loading Organisation Onboarding Requests!" }));

    return organisationsApi
      .organisationOnboardingRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setOrganisationOnboardingRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-org-onboarding-requests" }));
      });
  },
  exportOrganisationOnboardingRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisations-requests", msg: "Exporting Organisations Onboarding Requests List!" }));

    return organisationsApi
      .organisationOnboardingRequests({})
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisations-requests" }));
      });
  },
  createOrganisationOnboardingRequest: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-organisation-onboarding-request", msg: "Creating Organisation Onboarding Request!" }));

    return organisationsApi
      .createOrganisationOnboardingRequest(payload)
      .then(() => {
        toast.success("Organisation Onboarding Requests Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-organisation-onboarding-request" }));
      });
  },
  organisationOnboardingChangeRequests: (payload) => (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-org-onboarding-change-requests", msg: "Loading Organisation Onboarding Change Requests!" }));

    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    const newPayload = Object.assign({}, payload);
    newPayload.provider_id = JSON.stringify(providerId);

    return organisationsApi
      .organisationOnboardingChangeRequests(newPayload)
      .then((response) => {
        dispatch(slice.actions.setOrganisationOnboardingChangeRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-org-onboarding-change-requests" }));
      });
  },
  exportOrganisationOnboardingChangeRequests: () => (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisations-change-requests", msg: "Exporting Organisations Onboarding Change Requests List!" }));

    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    const payload = { provider_id: JSON.stringify(providerId) };

    return organisationsApi
      .organisationOnboardingChangeRequests(payload)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisations-change-requests" }));
      });
  },
  rejectOrganisationOnboardingRequest: (requestId: any, payload: any) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reject-organisation-onboarding-request", msg: "Rejecting Organisation onboarding Request!" }));
    return organisationsApi
      .rejectOrganisationOnboardingRequest(requestId, payload)
      .then(() => {
        toast.success("Organisation onboarding Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-organisation-onboarding-request" }));
      });
  },
  approveOrganisationOnboardingRequest:
    (requestId: any, providerId: any, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "approve-organisation-onboarding-request", msg: "Approving Organisation onboarding Request!" }));
      return organisationsApi
        .approveOrganisationOnboardingRequest(requestId, providerId, queryParams)
        .then(() => {
          toast.success("Organisation onboarding Request Approved Successfully!");
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "approve-organisation-onboarding-request" }));
        });
    },
  rejectOrganisationOnboardingChangeRequest: (requestId: any, payload: any) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reject-organisation-onboarding-change-request", msg: "Rejecting Organisation Onboarding Change Request!" }));
    return organisationsApi
      .rejectOrganisationOnboardingChangeRequest(requestId, payload)
      .then(() => {
        toast.success("Organisation onboarding Change Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-organisation-onboarding-change-request" }));
      });
  },
  approveOrganisationOnboardingChangeRequest: (requestId: any) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-organisation-onboarding-change-request", msg: "Approving Organisation Onboarding Change Request!" }));
    return organisationsApi
      .approveOrganisationOnboardingChangeRequest(requestId)
      .then(() => {
        toast.success("Organisation Onboarding Change Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-organisation-onboarding-change-request" }));
      });
  },
  onboardingRequestUserDetails: (requestId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-onboarding-request-user-details", msg: "Loading Onboarding Request User Details!" }));

    return organisationsApi
      .onboardingRequestUserDetails(requestId)
      .then((response) => {
        dispatch(slice.actions.setOnboardingRequestUserDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-onboarding-request-user-details" }));
      });
  },
  onboardingChangeRequestUserDetails: (requestId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-onboarding-change-request-user-details", msg: "Loading Onboarding Request User Details!" }));

    return organisationsApi
      .onboardingChangeRequestUserDetails(requestId)
      .then((response) => {
        dispatch(slice.actions.setOnboardingChangeRequestUserDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-onboarding-change-request-user-details" }));
      });
  },
  organisationUsers:
    (organisationId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-users", msg: "Loading Organisation Users!" }));

      return organisationsApi
        .organisationUsers(organisationId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setOrganisationUsers(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-users" }));
        });
    },
  exportOrganisationUsers: (organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisation-users", msg: "Exporting Organisations Users List!" }));

    return organisationsApi
      .organisationUsers(organisationId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisation-users" }));
      });
  },
  organisationQuotas:
    (organisationId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-quotas", msg: "Loading Organisation Quotas!" }));

      return organisationsApi
        .organisationQuotas(organisationId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setOrganisationQuotas(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-quotas" }));
        });
    },
  exportOrganisationQuotas: (organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisation-quotas", msg: "Exporting Organisations Quota List!" }));

    return organisationsApi
      .organisationQuotas(organisationId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisation-quotas" }));
      });
  },
  organisationQuotaTopups: (organisationId, providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-quota-topups", msg: "Loading Organisation Quota Topups!" }));

    return organisationsApi
      .organisationQuotaTopups(organisationId, providerId)
      .then((response) => {
        dispatch(slice.actions.setOrganisationQuotaTopups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-quota-topups" }));
      });
  },
  organisationResources:
    (organisationId, providerId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-resources", msg: "Loading Organisation Resources!" }));

      return organisationsApi
        .organisationResources(organisationId, providerId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setOrganisationResources(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-resources" }));
        });
    },
  organisationImages: (organisationId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-images", msg: "Loading Organisation Images!" }));

    return organisationsApi
      .organisationImages(organisationId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setOrganisationImages(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-images" }));
      });
  },
  exportOrganisationImages: (organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisation-images", msg: "Exporting Organisations Image List!" }));

    return organisationsApi
      .organisationImages(organisationId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisation-images" }));
      });
  },
  organisationFlavors: (organisationId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-flavors", msg: "Loading Organisation Flavors!" }));

    return organisationsApi
      .organisationFlavors(organisationId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setOrganisationFlavors(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-flavors" }));
      });
  },
  exportOrganisationFlavors: (organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisation-flavors", msg: "Exporting Organisations Flavor List!" }));

    return organisationsApi
      .organisationFlavors(organisationId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisation-flavors" }));
      });
  },
  organisationZones: (organisationId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-organisation-zones", msg: "Loading Organisation Zones!" }));

    return organisationsApi
      .organisationZones(organisationId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setOrganisationZones(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-organisation-zones" }));
      });
  },
  exportOrganisationZones: (organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-organisation-zones", msg: "Exporting Organisations Zone List!" }));

    return organisationsApi
      .organisationZones(organisationId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-organisation-zones" }));
      });
  },
  mapZoneToOrganisation: (organisationId, providerId, zoneId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "map-zone-to-organisation", msg: "Mapping Zone with Organisation!" }));

    return organisationsApi
      .mapZoneToOrganisation(organisationId, providerId, zoneId)
      .then(() => {
        toast.success("Mapped Zone with Organisation Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "map-zone-to-organisation" }));
      });
  },
  deleteImageOrgMapping: (organisationId, providerId, imageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-org-image-mapping", msg: "Deleting Mapping with Organisation!" }));

    return organisationsApi
      .deleteImageOrgMapping(organisationId, providerId, imageId)
      .then(() => {
        toast.success("Mapping within Organisation and Image Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-org-image-mapping" }));
      });
  },
  deleteFlavorOrgMapping: (organisationId, providerId, flavorId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-org-flavor-mapping", msg: "Deleting Mapping with Organisation!" }));

    return organisationsApi
      .deleteFlavorOrgMapping(organisationId, providerId, flavorId)
      .then(() => {
        toast.success("Mapping within Organisation and Flavor Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-org-flavor-mapping" }));
      });
  },
};

const getters = {
  organisations(rootState) {
    const state = rootState[name];
    return state.organisations;
  },
  organisationById(rootState, organisationId) {
    const state = rootState[name];
    return state.organisations?.list?.data?.find((organisation) => organisation?.id?.toString() === organisationId?.toString());
  },
  organisationRequests(rootState) {
    const state = rootState[name];
    return state.organisationRequests;
  },
  organisationChangeRequests(rootState) {
    const state = rootState[name];
    return state.organisationChangeRequests;
  },
  onboardingRequestUserDetails(rootState) {
    const state = rootState[name];
    return state.onboardingRequestUserDetails;
  },
  onboardingChangeRequestUserDetails(rootState) {
    const state = rootState[name];
    return state.onboardingChangeRequestUserDetails;
  },
  organisationUsers(rootState) {
    const state = rootState[name];
    return state.organisationUsers;
  },
  organisationQuotas(rootState) {
    const state = rootState[name];
    return state.organisationQuotas;
  },
  organisationQuotaTopups(rootState) {
    const state = rootState[name];
    return state.organisationQuotaTopups;
  },
  organisationResources(rootState) {
    const state = rootState[name];
    return state.organisationResources;
  },
  organisationImages(rootState) {
    const state = rootState[name];
    return state.organisationImages;
  },
  organisationFlavors(rootState) {
    const state = rootState[name];
    return state.organisationFlavors;
  },
  organisationZones(rootState) {
    const state = rootState[name];
    return state.organisationZones;
  },
};

export default {
  actions,
  getters,
  slice,
};
