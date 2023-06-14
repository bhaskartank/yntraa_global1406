import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListVirtualMachine from "components/templates/compute/ListVirtualMachine";

const ListVirtualMachinePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const compute = virtualMachinesRedux.getters.compute(rootState);
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchVMList = useCallback(
    (payload) => {
      dispatch(virtualMachinesRedux.actions.vmList(payload));
    },
    [dispatch],
  );

  const vmListExport = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.vmListExport());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchCurrentStatus = useCallback(
    (item) => {
      dispatch(virtualMachinesRedux.actions.currentStatus({ providerId: item?.provider_id, computeId: item?.id }));
    },
    [dispatch],
  );

  const markVMAsError = useCallback(
    (item) => {
      dispatch(virtualMachinesRedux.actions.markErrorInVm({ providerId: item?.provider_id, computeId: item?.id }));
    },
    [dispatch],
  );

  const fetchConsoleURL = useCallback(
    async (item) => {
      try {
        const { console_url: consoleURL } = await dispatch(
          virtualMachinesRedux.actions.consoleUrl({ providerId: item?.provider_id, projectId: item?.project_id, computeId: item?.id }),
        );
        navigate(`/compute/${item?.id}/console`, { state: { consoleURL, compute: item } });
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const fetchConsoleLogs = useCallback(
    async (item) => {
      try {
        const { console_log: consoleLog, console_url: consoleURL } = await dispatch(
          virtualMachinesRedux.actions.consoleLogs({ providerId: item?.provider_id, projectId: item?.project_id, computeId: item?.id }),
        );

        navigate(`/compute/${item?.id}/console-logs`, { state: { consoleLog, consoleURL, compute: item } });
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const fetchOwnerDetail = useCallback(
    (item) => {
      dispatch(virtualMachinesRedux.actions.computeOwnerDetails({ providerId: item?.provider_id, computeId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="VM Resources" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "VM Resources" }]}>
      <ListVirtualMachine
        compute={compute}
        fetchVMList={fetchVMList}
        vmListExport={vmListExport}
        fetchCurrentStatus={fetchCurrentStatus}
        markVMAsError={markVMAsError}
        fetchConsoleURL={fetchConsoleURL}
        fetchConsoleLogs={fetchConsoleLogs}
        defaultFilters={defaultFilters}
        fetchOwnerDetail={fetchOwnerDetail}
      />
      <ResourseOwnerDetail modalTitle="Owner details" />
    </PageContainer>
  );
};

export default ListVirtualMachinePage;
