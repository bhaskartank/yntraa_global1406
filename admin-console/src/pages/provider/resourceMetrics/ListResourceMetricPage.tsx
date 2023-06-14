import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListResourceMetrics from "components/templates/providers/resourceMetrics/ListResourceMetrics";

const ListResourceMetricPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchResourceMetrics = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.resourceMetrics(payload));
    },
    [dispatch],
  );

  const exportResourceMetrics = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportResourceMetrics());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const deleteResourceMetric = useCallback(
    async (resourceMetricId) => {
      try {
        await dispatch(providersRedux.actions.deleteResourceMetric(resourceMetricId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Resource Metrics" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Resource Metrics" }]}>
      <ListResourceMetrics
        fetchResourceMetrics={fetchResourceMetrics}
        exportResourceMetrics={exportResourceMetrics}
        deleteResourceMetric={deleteResourceMetric}
        defaultFilters={defaultFilters}
      />
    </PageContainer>
  );
};

export default ListResourceMetricPage;
