import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import resourceMetricRedux from "store/modules/resource-metrics";
import virtualMachineRedux from "store/modules/virtual-machines";

import PageContainer from "components/layouts/Frame/PageContainer";
import VirtualMachineDetail from "components/templates/compute/VirtualMachineDetail";

import { pageTitles } from "utils/constants";

const VirtualMachineDetailPage = () => {
  const { virtualMachineId } = useParams();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const virtualMachineById = virtualMachineRedux.getters.virtualMachineById(rootState);
  const consoleLogs = virtualMachineRedux.getters.consoleLogs(rootState);
  const consoleURL = virtualMachineRedux.getters.consoleURL(rootState);

  const fetchVirtualMachineById = useCallback(() => {
    dispatch(virtualMachineRedux.actions.virtualMachineById(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchConsoleLogs = useCallback(() => {
    dispatch(virtualMachineRedux.actions.consoleLogs(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchConsoleURL = useCallback(() => {
    dispatch(virtualMachineRedux.actions.consoleURL(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchResourceMetrics = useCallback(() => {
    dispatch(resourceMetricRedux.actions.resourceMetrics(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  const fetchUsageGraph = useCallback(() => {
    dispatch(resourceMetricRedux.actions.usageGraph(virtualMachineId));
  }, [dispatch, virtualMachineId]);

  useEffect(() => {
    fetchVirtualMachineById();
  }, [fetchVirtualMachineById]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_VIRTUAL_MACHINE_DETAIL} hideTitle>
      <VirtualMachineDetail
        virtualMachine={virtualMachineById}
        consoleLogs={consoleLogs}
        fetchConsoleLogs={fetchConsoleLogs}
        consoleURL={consoleURL}
        fetchConsoleURL={fetchConsoleURL}
        fetchResourceMetrics={fetchResourceMetrics}
        fetchUsageGraph={fetchUsageGraph}
      />
    </PageContainer>
  );
};

export default VirtualMachineDetailPage;
