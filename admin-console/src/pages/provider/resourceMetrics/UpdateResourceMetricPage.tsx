import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import UpdateResourceMetricBar from "components/molecules/DetailBars/UpdateResourceMetricBar";
import UpdateResourceMetric from "components/templates/providers/resourceMetrics/ResourceMetricForm";

const UpdateResourceMetricPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();
  const { resourceMetric } = routerState;

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateResourceMetric(resourceMetric?.id, payload));
        navigate("/providers/resource-metrics");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, resourceMetric],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Update Resource Metric"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Resource Metrics", to: "/providers/resource-metrics" }, { label: "Update Resource Metric" }]}>
      <UpdateResourceMetricBar resourceMetric={resourceMetric} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <UpdateResourceMetric onSubmit={handleUpdate} providers={providers?.list?.data || []} defaultValues={resourceMetric} />
    </PageContainer>
  );
};

export default UpdateResourceMetricPage;
