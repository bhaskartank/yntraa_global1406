import { createSlice } from "@reduxjs/toolkit";
import providersApi from "observability/api/providers";
import { toast } from "react-toastify";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "providers";
const initialState = {
  providers: { list: [], totalRecords: 0 },
  images: { list: [], totalRecords: 0 },
  flavors: { list: [], totalRecords: 0 },
  zones: { list: [], totalRecords: 0 },
  defaultRules: { list: [], totalRecords: 0 },
  resourceMetrics: { list: [], totalRecords: 0 },
  hypervisors: { list: [], totalRecords: 0 },
  openstackNetworks: { list: [], totalRecords: 0 },
  openstackSubnets: { list: [], totalRecords: 0 },
  openstackPorts: { list: [], totalRecords: 0 },
  openstackFloatingIPs: { list: [], totalRecords: 0 },
  availableBaseQuota: { list: [], totalRecords: 0 },
  availableTopupQuota: { list: [], totalRecords: 0 },
  providerTypes: null,
  publicKeys: { list: [], totalRecords: 0 },
  resourceTopup: { list: [], totalRecords: 0 },
  attachedQuota: { list: [], totalRecords: 0 },
  serviceProviders: { list: [], totalRecords: 0 },
  serviceTypes: [],
  providerResourceMapping: { list: [], totalRecords: 0 },
  resourceTypes: [],
  imageResourceMapping: [],
  quotaMappedOrganisation: { list: [], totalRecords: 0 },
  quotaMappedProviders: { list: [], totalRecords: 0 },
  initScript: null,
  initScriptVariables: { list: [], totalRecords: 0 },
  initScriptHistory: { list: [], totalRecords: 0 },
  defaultRuleProjects: [],
};
const slice = createSlice({
  name,
  initialState,
  reducers: {
    setProviders(state, { payload }) {
      state.providers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setImages(state, { payload }) {
      state.images = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setFlavors(state, { payload }) {
      state.flavors = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setZones(state, { payload }) {
      state.zones = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setDefaultRules(state, { payload }) {
      state.defaultRules = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setResourceMetrics(state, { payload }) {
      state.resourceMetrics = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setHypervisors(state, { payload }) {
      state.hypervisors = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOpenstackNetworks(state, { payload }) {
      state.openstackNetworks = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOpenstackSubnets(state, { payload }) {
      state.openstackSubnets = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOpenstackPorts(state, { payload }) {
      state.openstackPorts = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setOpenstackFloatingIPs(state, { payload }) {
      state.openstackFloatingIPs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAvailableBaseQuota(state, { payload }) {
      state.availableBaseQuota = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAvailableTopupQuota(state, { payload }) {
      state.availableTopupQuota = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setProviderTypes(state, { payload }) {
      state.providerTypes = payload;
    },
    setPublicKeys(state, { payload }) {
      state.publicKeys = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setResourceTopup(state, { payload }) {
      state.resourceTopup = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAttachedQuota(state, { payload }) {
      state.attachedQuota = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setServiceProviders(state, { payload }) {
      state.serviceProviders = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setServiceTypes(state, { payload }) {
      state.serviceTypes = payload.data;
    },
    setResourceMapping(state, { payload }) {
      state.providerResourceMapping = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setResourceTypes(state, { payload }) {
      state.resourceTypes = payload.data;
    },
    setImageResourceMapping(state, { payload }) {
      state.imageResourceMapping = payload.data;
    },
    setQuotaMappedOrganisation(state, { payload }) {
      state.quotaMappedOrganisation = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setQuotaMappedProviders(state, { payload }) {
      state.quotaMappedProviders = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setInitScript(state, { payload }) {
      state.initScript = payload.data;
    },
    resetInitScript(state) {
      state.initScript = initialState.initScript;
    },
    setInitScriptVariables(state, { payload }) {
      state.initScriptVariables = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setInitScriptHistory(state, { payload }) {
      state.initScriptHistory = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setDefaultRuleProjects(state, { payload }) {
      state.defaultRuleProjects = payload.data;
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
  providers: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-providers", msg: "Loading Providers!" }));

    return providersApi
      .providers()
      .then((response) => {
        dispatch(slice.actions.setProviders(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-providers" }));
      });
  },
  exportProviders: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-providers", msg: "Exporting Providers List!" }));

    return providersApi
      .providers()
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-providers" }));
      });
  },
  images:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-images", msg: "Loading Images!" }));

      return providersApi
        .images(queryParams)
        .then((response) => {
          dispatch(slice.actions.setImages(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-images" }));
        });
    },
  exportImages: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-images", msg: "Exporting Provider Image List!" }));

    return providersApi
      .images()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-images" }));
      });
  },
  flavors:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-flavors", msg: "Loading Flavors!" }));

      return providersApi
        .flavors(queryParams)
        .then((response) => {
          dispatch(slice.actions.setFlavors(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-flavors" }));
        });
    },
  exportFlavors: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-flavors", msg: "Exporting Provider Flavors List!" }));

    return providersApi
      .flavors()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-flavors" }));
      });
  },
  zones:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-zones", msg: "Loading Zones!" }));

      return providersApi
        .zones(queryParams)
        .then((response) => {
          dispatch(slice.actions.setZones(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-zones" }));
        });
    },
  exportZones: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-zones", msg: "Exporting Provider Zone List!" }));

    return providersApi
      .zones()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-zones" }));
      });
  },
  defaultRules:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-default-rules", msg: "Loading Default Rules!" }));

      return providersApi
        .defaultRules(queryParams)
        .then((response) => {
          dispatch(slice.actions.setDefaultRules(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-default-rules" }));
        });
    },
  exportDefaultRules: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-default-rules", msg: "Exporting Provider Default Rules List!" }));

    return providersApi
      .defaultRules()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-default-rules" }));
      });
  },
  resourceMetrics:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-resource-metrics", msg: "Loading Resource Metrics!" }));

      return providersApi
        .resourceMetrics(queryParams)
        .then((response) => {
          dispatch(slice.actions.setResourceMetrics(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-resource-metrics" }));
        });
    },
  exportResourceMetrics: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-resource-metrics", msg: "Exporting Provider Resource Metrics List!" }));

    return providersApi
      .resourceMetrics()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-resource-metrics" }));
      });
  },
  hypervisors:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-hypervisors", msg: "Loading Hypervisors!" }));

      return providersApi
        .hypervisors(queryParams)
        .then((response) => {
          dispatch(slice.actions.setHypervisors(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-hypervisors" }));
        });
    },
  exportHypervisors:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-hypervisors", msg: "Exporting Provider Hypervisors List!" }));

      return providersApi
        .hypervisors(queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-hypervisors" }));
        });
    },
  openstackNetworks:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-openstack-networks", msg: "Loading Openstack Networks!" }));

      return providersApi
        .openstackNetworks(queryParams)
        .then((response) => {
          dispatch(slice.actions.setOpenstackNetworks(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-openstack-networks" }));
        });
    },
  exportOpenstackNetworks:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-openstack-networks", msg: "Exporting Provider Openstack Network List!" }));

      return providersApi
        .openstackNetworks(queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-openstack-networks" }));
        });
    },
  openstackSubnets:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-openstack-subnets", msg: "Loading Openstack Subnets!" }));

      return providersApi
        .openstackSubnets(queryParams)
        .then((response) => {
          dispatch(slice.actions.setOpenstackSubnets(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-openstack-subnets" }));
        });
    },
  exportOpenstackSubnets:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-openstack-subnets", msg: "Exporting Provider Openstack Subnet List!" }));

      return providersApi
        .openstackSubnets(queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-openstack-subnets" }));
        });
    },
  openstackPorts:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-openstack-ports", msg: "Loading Openstack Ports!" }));

      return providersApi
        .openstackPorts(queryParams)
        .then((response) => {
          dispatch(slice.actions.setOpenstackPorts(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-openstack-ports" }));
        });
    },
  exportOpenstackPorts:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-openstack-ports", msg: "Exporting Provider Openstack Port List!" }));

      return providersApi
        .openstackPorts(queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-openstack-ports" }));
        });
    },
  openstackFloatingIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-openstack-floating-ips", msg: "Loading Openstack Floating IPs!" }));

      return providersApi
        .openstackFloatingIPs(queryParams)
        .then((response) => {
          dispatch(slice.actions.setOpenstackFloatingIPs(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-openstack-floating-ips" }));
        });
    },
  exportOpenstackFloatingIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-openstack-floating-ips", msg: "Exporting Provider Openstack Floating IPs List!" }));

      return providersApi
        .openstackFloatingIPs(queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-openstack-floating-ips" }));
        });
    },
  availableBaseQuota:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-available-base-quota", msg: "Loading Available Base Quota!" }));

      return providersApi
        .availableBaseQuota(queryParams)
        .then((response) => {
          dispatch(slice.actions.setAvailableBaseQuota(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-available-base-quota" }));
        });
    },
  exportAvailableBaseQuota: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-available-base-quota", msg: "Exporting Available Base Quota List!" }));

    return providersApi
      .availableBaseQuota()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-available-base-quota" }));
      });
  },
  availableTopupQuota:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-available-topup-quota", msg: "Loading Available Topup Quota!" }));

      return providersApi
        .availableTopupQuota(queryParams)
        .then((response) => {
          dispatch(slice.actions.setAvailableTopupQuota(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-available-topup-quota" }));
        });
    },
  exportAvailableTopupQuota: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-available-topup-quota", msg: "Exporting Available Topup Quota List!" }));

    return providersApi
      .availableTopupQuota()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-available-topup-quota" }));
      });
  },
  providerTypes:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-types", msg: "Loading Provider Types!" }));

      return providersApi
        .providerTypes(queryParams)
        .then((response) => {
          dispatch(slice.actions.setProviderTypes(response.data));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-types" }));
        });
    },
  createProvider: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-provider", msg: "Creating Provider!" }));

    return providersApi
      .createProvider(payload)
      .then(() => {
        toast.success("Provider Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-provider" }));
      });
  },
  testConnection: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "test-provider-connection", msg: "Testing Connection!" }));

    return providersApi
      .testConnection(payload)
      .then(() => {
        toast.success("Provider Connection Successful!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "test-provider-connection" }));
      });
  },
  createDefaultRule: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-default-rule", msg: "Creating Default Rule!" }));

    return providersApi
      .createDefaultRule(providerId, payload)
      .then(() => {
        toast.success("Default Rule Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-default-rule" }));
      });
  },
  deleteDefaultRule: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-default-rule", msg: "Deleting Default Rule!" }));

    return providersApi
      .deleteDefaultRule(providerId, payload)
      .then(() => {
        toast.success("Default Rule Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-default-rule" }));
      });
  },
  publicKeys: (providerId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-provider-public-keys", msg: "Loading Public Keys!" }));

    return providersApi
      .publicKeys(providerId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setPublicKeys(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-public-keys" }));
      });
  },
  createPublickey: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-provider-public-keys", msg: "Creating Public Keys!" }));

    return providersApi
      .createPublicKey(providerId, payload)
      .then(() => {
        toast.success("Public Key Added Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-provider-public-keys" }));
      });
  },
  resourceTopup: (providerId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-resource-topup", msg: "Loading Resource Topup!" }));

    return providersApi
      .resourceTopup(providerId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setResourceTopup(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup" }));
      });
  },
  exportResourceTopup: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-resource-topup", msg: "Exporting Resource Topup List!" }));

    return providersApi
      .resourceTopup(providerId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-resource-topup" }));
      });
  },
  attachedQuota: (providerId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-attached-quota", msg: "Loading Attached Quota Packages!" }));

    return providersApi
      .attachedQuota(providerId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setAttachedQuota(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-attached-quota" }));
      });
  },
  exportAttachedQuota: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-quota", msg: "Exporting Attached Quota Package List!" }));

    return providersApi
      .attachedQuota(providerId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-quota" }));
      });
  },
  attachQuota: (providerId, quotaPackageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-attach-quota", msg: "Attaching Quota!" }));

    return providersApi
      .attachQuota(providerId, quotaPackageId)
      .then(() => {
        toast.success("Quota Attached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-attach-quota" }));
      });
  },
  detachQuota: (providerId, quotaPackageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-detach-quota", msg: "Detaching Quota!" }));

    return providersApi
      .detachQuota(providerId, quotaPackageId)
      .then(() => {
        toast.success("Quota Detached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-detach-quota" }));
      });
  },
  attachResourceTopup: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-attach-resource-topup", msg: "Attaching Resource Topup!" }));

    return providersApi
      .attachResourceTopup(providerId, payload)
      .then(() => {
        toast.success("Resource Topup Attached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-attach-resource-topup" }));
      });
  },
  detachResourceTopup: (providerId, resourceTopupId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-detach-resource-topup", msg: "Detaching Resource Topup!" }));

    return providersApi
      .detachResourceTopup(providerId, resourceTopupId)
      .then(() => {
        toast.success("Resource Topup Detached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-detach-resource-topup" }));
      });
  },
  serviceProviders: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-service-providers", msg: "Loading Service Providers!" }));

    return providersApi
      .serviceProviders(providerId)
      .then((response) => {
        dispatch(slice.actions.setServiceProviders(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-service-providers" }));
      });
  },
  exportServiceProviders: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-service-providers", msg: "Exporting Service Provider List!" }));

    return providersApi
      .serviceProviders(providerId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-service-providers" }));
      });
  },
  createServiceProvider: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-service-provider", msg: "Creating Service Provider!" }));

    return providersApi
      .createServiceProvider(providerId, payload)
      .then(() => {
        toast.success("Service Provider Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-service-provider" }));
      });
  },
  updateServiceProvider: (providerId, serviceProviderId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-service-provider", msg: "Updating Service Provider!" }));

    return providersApi
      .updateServiceProvider(providerId, serviceProviderId, payload)
      .then(() => {
        toast.success("Service Provider Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-service-provider" }));
      });
  },
  serviceTypes: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-service-types", msg: "Loading Service Types!" }));

    return providersApi
      .serviceTypes()
      .then((response) => {
        dispatch(slice.actions.setServiceTypes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-service-types" }));
      });
  },
  providerResourceMapping: (providerId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-provider-resource-mapping", msg: "Loading Provider Resource Mapping!" }));

    return providersApi
      .providerResourceMapping(providerId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setResourceMapping(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-resource-mapping" }));
      });
  },
  exportProviderResourceMapping: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-resource-mapping", msg: "Exporting Provider Resource Mapping List!" }));

    return providersApi
      .providerResourceMapping(providerId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-resource-mapping" }));
      });
  },
  deleteProviderResourceMapping: (providerId, resourceImageFlavorId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-delete-resource-mapping", msg: "Deleting Provider Resource Mapping!" }));

    return providersApi
      .deleteProviderResourceMapping(providerId, resourceImageFlavorId)
      .then(() => {
        toast.success("Provider Resource Mapping Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-delete-resource-mapping" }));
      });
  },
  resourceTypes: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-resource-types", msg: "Loading Resource Types!" }));

    return providersApi
      .resourceTypes()
      .then((response) => {
        dispatch(slice.actions.setResourceTypes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-types" }));
      });
  },
  createProviderResourceMapping: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-provider-resource-mapping", msg: "Adding Provider Resource Mapping!" }));

    return providersApi
      .createProviderResourceMapping(providerId, payload)
      .then(() => {
        toast.success("Provider Resource Mapping Added Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-provider-resource-mapping" }));
      });
  },
  updateImage: (providerId, imageId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-image", msg: "Updating Image!" }));

    return providersApi
      .updateImage(providerId, imageId, payload)
      .then(() => {
        toast.success("Image Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-image" }));
      });
  },
  imageOrganisationMapping: (providerId, imageId, organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "image-organisation-mapping", msg: "Mapping Image to Organisation!" }));

    return providersApi
      .imageOrganisationMapping(providerId, imageId, organisationId)
      .then(() => {
        toast.success("Image Mapped to Organisation Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "image-organisation-mapping" }));
      });
  },
  imageResourceMapping: (providerId, imageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-image-resource-mapping", msg: "Loading Image Resource Mapping!" }));

    return providersApi
      .imageResourceMapping(providerId, imageId)
      .then((response) => {
        dispatch(slice.actions.setImageResourceMapping(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-image-resource-mapping" }));
      });
  },
  exportImageResourceMapping: (providerId, imageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-image-resource-mapping", msg: "Exporting Image Resource Mapping!" }));

    return providersApi
      .imageResourceMapping(providerId, imageId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-image-resource-mapping" }));
      });
  },
  createImageResourceMapping: (providerId, imageId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-image-resource-mapping", msg: "Mapping Image with Resource!" }));

    return providersApi
      .createImageResourceMapping(providerId, imageId, payload)
      .then(() => {
        toast.success("Image Mapped to Resource Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-image-resource-mapping" }));
      });
  },
  createFlavor: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-flavor", msg: "Creating Flavor!" }));

    return providersApi
      .createFlavor(providerId, payload)
      .then(() => {
        toast.success("Flavor Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-flavor" }));
      });
  },
  updateFlavor: (providerId, flavorId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-flavor", msg: "Updating Flavor!" }));

    return providersApi
      .updateFlavor(providerId, flavorId, payload)
      .then(() => {
        toast.success("Flavor Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-flavor" }));
      });
  },
  flavorOrganisationMapping: (providerId, flavorId, organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "flavor-organisation-mapping", msg: "Mapping Flavor to Organisation!" }));

    return providersApi
      .flavorOrganisationMapping(providerId, flavorId, organisationId)
      .then(() => {
        toast.success("Flavor Mapped to Organisation Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "flavor-organisation-mapping" }));
      });
  },
  updateZone: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-zone", msg: "Updating Availability Zone!" }));

    return providersApi
      .updateZone(providerId, payload)
      .then(() => {
        toast.success("Availability Zone Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-zone" }));
      });
  },
  zoneOrganisationMapping: (providerId, zoneId, organisationId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "zone-organisation-mapping", msg: "Mapping Zone to Organisation!" }));

    return providersApi
      .zoneOrganisationMapping(providerId, zoneId, organisationId)
      .then(() => {
        toast.success("Zone Mapped to Organisation Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "zone-organisation-mapping" }));
      });
  },
  syncZones: (providerId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "sync-zones", msg: "Syncing Availability Zones!" }));

    return providersApi
      .syncZones(providerId, queryParams)
      .then(() => {
        toast.success("Availability Zones Synced Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "sync-zones" }));
      });
  },
  createResourceMetric: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-resource-metric", msg: "Creating Resource Metric!" }));

    return providersApi
      .createResourceMetric(payload)
      .then(() => {
        toast.success("Resource Metric Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-resource-metric" }));
      });
  },
  updateResourceMetric: (resourceMetricId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-resource-metric", msg: "Updating Resource Metric!" }));

    return providersApi
      .updateResourceMetric(resourceMetricId, payload)
      .then(() => {
        toast.success("Resource Metric Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-resource-metric" }));
      });
  },
  deleteResourceMetric: (resourceMetricId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-resource-metric", msg: "Deleting Resource Metric!" }));

    return providersApi
      .deleteResourceMetric(resourceMetricId)
      .then(() => {
        toast.success("Resource Metric Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-resource-metric" }));
      });
  },
  quotaMappedOrganisation: (quotaId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-quota-organisation-mapping", msg: "Loading Quota Organisation Mapping!" }));

    return providersApi
      .quotaMappedOrganisation(quotaId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setQuotaMappedOrganisation(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-quota-organisation-mapping" }));
      });
  },
  exportQuotaMappedOrganisation: (quotaId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-quota-organisation-mapping", msg: "Exporting Quota Organisation Mapping!" }));

    return providersApi
      .quotaMappedOrganisation(quotaId, queryParams)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-quota-organisation-mapping" }));
      });
  },
  quotaMappedProviders: (quotaId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-quota-provider-mapping", msg: "Loading Quota Provider Mapping!" }));

    return providersApi
      .quotaMappedProviders(quotaId, queryParams)
      .then((response) => {
        dispatch(slice.actions.setQuotaMappedProviders(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-quota-provider-mapping" }));
      });
  },
  exportQuotaMappedProviders: (quotaId, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-quota-provider-mapping", msg: "Exporting Quota Provider Mapping!" }));

    return providersApi
      .quotaMappedProviders(quotaId, queryParams)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-quota-provider-mapping" }));
      });
  },
  initScript:
    (providerId, imageId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "fetch-init-script", msg: "Loading Init Script!" }));

      return providersApi
        .initScript(providerId, imageId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setInitScript(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "fetch-init-script" }));
        });
    },
  addInitScript: (providerId, imageId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "add-init-script", msg: "Adding Init Script!" }));

    return providersApi
      .addInitScript(providerId, imageId, payload)
      .then(() => {
        toast.success("Init Script Added Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "add-init-script" }));
      });
  },
  updateInitScript: (providerId, imageId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-init-script", msg: "Updating Init Script!" }));

    return providersApi
      .updateInitScript(providerId, imageId, payload)
      .then(() => {
        toast.success("Init Script Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-init-script" }));
      });
  },
  deleteInitScript:
    (providerId, imageId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "delete-init-script", msg: "Deleting Init Script!" }));

      return providersApi
        .deleteInitScript(providerId, imageId, queryParams)
        .then(() => {
          toast.success("Init Script Deleted Successfully!");
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "delete-init-script" }));
        });
    },
  initScriptVariables:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "fetch-init-script-variables", msg: "Loading Init Script Variables!" }));

      return providersApi
        .initScriptVariables(queryParams)
        .then((response) => {
          dispatch(slice.actions.setInitScriptVariables(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "fetch-init-script-variables" }));
        });
    },
  initScriptHistory:
    (providerId, imageId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "fetch-init-script-history", msg: "Loading Init Script History!" }));

      return providersApi
        .initScriptHistory(providerId, imageId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setInitScriptHistory(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "fetch-init-script-history" }));
        });
    },
  exportInitScriptHistory:
    (providerId, imageId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-init-script-history", msg: "Exporting Init Script History List!" }));

      return providersApi
        .initScriptHistory(providerId, imageId, queryParams)
        .then((response) => {
          return response.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-init-script-history" }));
        });
    },
  defaultRuleProjects:
    (providerId, defaultRuleId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "fetch-default-rule-projects", msg: "Loading Default Rule Projects!" }));

      return providersApi
        .defaultRuleProjects(providerId, defaultRuleId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setDefaultRuleProjects(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "fetch-default-rule-projects" }));
        });
    },
  applyRuleOnProjects: (providerId, defaultRuleId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "apply-rule-projects", msg: "Applying Rule on Project(s)!" }));

    return providersApi
      .applyRuleOnProjects(providerId, defaultRuleId, payload)
      .then(() => {
        toast.success("Rule Applied on Project(s) Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "apply-rule-projects" }));
      });
  },
  removeRuleFromProjects: (providerId, defaultRuleId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "remove-rule-projects", msg: "Removing Rule from Projects!" }));

    return providersApi
      .removeRuleFromProjects(providerId, defaultRuleId, payload)
      .then(() => {
        toast.success("Rule Removed from Projects Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "remove-rule-projects" }));
      });
  },
  syncImageWithHorizon: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "sync-image-with-horizon", msg: "Syncing Image with Horizon!" }));

    return providersApi
      .syncImageWithHorizon(providerId)
      .then(() => {
        toast.success("Synced Image with Horizon Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "sync-image-with-horizon" }));
      });
  },
  syncFlavorWithHorizon: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "sync-flavor-with-horizon", msg: "Syncing Flavor with Horizon!" }));

    return providersApi
      .syncFlavorWithHorizon(providerId)
      .then(() => {
        toast.success("Synced Flavor with Horizon Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "sync-flavor-with-horizon" }));
      });
  },
};

const getters = {
  providers(rootState) {
    const state = rootState[name];
    return state.providers;
  },
  providerById(rootState, id) {
    const state = rootState[name];
    return state.providers?.list?.data?.find((provider) => provider?.id?.toString() === id?.toString());
  },
  images(rootState) {
    const state = rootState[name];
    return state.images;
  },
  flavors(rootState) {
    const state = rootState[name];
    return state.flavors;
  },
  zones(rootState) {
    const state = rootState[name];
    return state.zones;
  },
  defaultRules(rootState) {
    const state = rootState[name];
    return state.defaultRules;
  },
  resourceMetrics(rootState) {
    const state = rootState[name];
    return state.resourceMetrics;
  },
  hypervisors(rootState) {
    const state = rootState[name];
    return state.hypervisors;
  },
  openstackNetworks(rootState) {
    const state = rootState[name];
    return state.openstackNetworks;
  },
  openstackSubnets(rootState) {
    const state = rootState[name];
    return state.openstackSubnets;
  },
  openstackPorts(rootState) {
    const state = rootState[name];
    return state.openstackPorts;
  },
  openstackFloatingIPs(rootState) {
    const state = rootState[name];
    return state.openstackFloatingIPs;
  },
  availableBaseQuota(rootState) {
    const state = rootState[name];
    return state.availableBaseQuota;
  },
  availableTopupQuota(rootState) {
    const state = rootState[name];
    return state.availableTopupQuota;
  },
  providerTypes(rootState) {
    const state = rootState[name];
    return state.providerTypes;
  },
  publicKeys(rootState) {
    const state = rootState[name];
    return state.publicKeys;
  },
  resourceTopup(rootState) {
    const state = rootState[name];
    return state.resourceTopup;
  },
  attachedQuota(rootState) {
    const state = rootState[name];
    return state.attachedQuota;
  },
  serviceProviders(rootState) {
    const state = rootState[name];
    return state.serviceProviders;
  },
  serviceProviderById(rootState, id) {
    const state = rootState[name];
    return state.serviceProviders?.list?.find((provider) => provider?.id?.toString() === id?.toString());
  },
  serviceTypes(rootState) {
    const state = rootState[name];
    return state.serviceTypes;
  },
  providerResourceMapping(rootState) {
    const state = rootState[name];
    return state.providerResourceMapping;
  },
  resourceTypes(rootState) {
    const state = rootState[name];
    return state.resourceTypes;
  },
  imageResourceMapping(rootState) {
    const state = rootState[name];
    return state.imageResourceMapping;
  },
  quotaMappedOrganisation(rootState) {
    const state = rootState[name];
    return state.quotaMappedOrganisation;
  },
  quotaMappedProviders(rootState) {
    const state = rootState[name];
    return state.quotaMappedProviders;
  },
  initScript(rootState) {
    const state = rootState[name];
    return state.initScript;
  },
  initScriptVariables(rootState) {
    const state = rootState[name];
    return state.initScriptVariables;
  },
  initScriptHistory(rootState) {
    const state = rootState[name];
    return state.initScriptHistory;
  },
  defaultRuleProjects(rootState) {
    const state = rootState[name];
    return state.defaultRuleProjects;
  },
};

export default {
  actions,
  getters,
  slice,
};
