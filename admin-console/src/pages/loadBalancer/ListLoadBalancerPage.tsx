import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import loadBalancersRedux from "store/modules/loadBalancers";
import modalRedux from "store/modules/modals";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import VmDetailsByLbBackend from "components/modals/vmDetailsByLbBackend";
import ListLoadBalancers from "components/templates/loadBalancers/ListLoadBalancers";

const ListLoadBalancerPage = () => {
  const navigate = useNavigate();
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchLoadBalancers = useCallback(
    (payload) => {
      dispatch(loadBalancersRedux.actions.loadBalancers(payload));
    },
    [dispatch],
  );

  const exportLoadBalancers = useCallback(async () => {
    try {
      return await dispatch(loadBalancersRedux.actions.exportLoadBalancers());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchLoadBalancerOwnerDetail = useCallback(
    (item) => {
      dispatch(loadBalancersRedux.actions.computeLoadBalancerOwnerDetails({ providerId: item?.provider_id, loadBalancerId: item?.id }));
    },
    [dispatch],
  );

  const fetchVmDetailByLbBackend = useCallback(
    async (item) => {
      await dispatch(modalRedux.actions.vmDetailByLbBackend(true));
      await dispatch(virtualMachinesRedux.actions.vmById({ computeId: item?.id, providerId: item?.provider_id }));
    },
    [dispatch],
  );

  const markLbAsErrorRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(loadBalancersRedux.actions.markLbAsErrorRequest(payload?.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  const fetchAppliedLBConfig = useCallback(
    async (item) => {
      try {
        if (item?.lb_device_ip !== "") {
          await dispatch(loadBalancersRedux.actions.fetchAppliedLBConfig(item?.provider_id, item?.project_id, item?.id));
          navigate("/load-balancers/fetch-applied-config", { state: { lbDetail: item } });
        } else {
          toast.error("Load Balancer do not have Floating IP Attached !");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const fetchLBLogs = useCallback(
    async (item) => {
      try {
        if (item?.lb_device_ip !== "") {
          await dispatch(loadBalancersRedux.actions.fetchLBLogs(item?.provider_id, item?.project_id, item?.id));
          navigate(`/load-balancers/${item?.id}/lb-logs`, { state: { lbDetails: item } });
        } else {
          toast.error("Load Balancer do not have Floating IP Attached !");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const fetchLBConfigTemplate = useCallback(
    async (item) => {
      try {
        if (item?.lb_device_ip !== "") {
          await dispatch(loadBalancersRedux.actions.fetchLBConfigTemplate(item?.provider_id, item?.project_id, item?.id));
          navigate(`/load-balancers/${item?.id}/lb-config-template`, { state: { lbDetails: item } });
        } else {
          toast.error("Load Balancer do not have Floating IP Attached !");
        }
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  return (
    <PageContainer title="Load Balancers" breadcrumbs={[{ label: "Load Balancers" }]}>
      <ListLoadBalancers
        fetchLoadBalancers={fetchLoadBalancers}
        exportLoadBalancers={exportLoadBalancers}
        fetchLoadBalancerOwnerDetail={fetchLoadBalancerOwnerDetail}
        fetchAppliedLBConfig={fetchAppliedLBConfig}
        fetchLBLogs={fetchLBLogs}
        fetchLBConfigTemplate={fetchLBConfigTemplate}
        defaultFilters={defaultFilters}
        markLbAsError={markLbAsErrorRequest}
        fetchVmDetailByLbBackend={fetchVmDetailByLbBackend}
      />
      <ResourseOwnerDetail modalTitle="Load Balancer Owner Details" />
      <VmDetailsByLbBackend modalTitle="Compute Overview" />
    </PageContainer>
  );
};

export default ListLoadBalancerPage;
