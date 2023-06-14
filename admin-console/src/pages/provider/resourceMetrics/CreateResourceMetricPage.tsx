import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateResourceMetric from "components/templates/providers/resourceMetrics/ResourceMetricForm";

const CreateResourceMetricPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createResourceMetric(payload));
        navigate("/providers/resource-metrics");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Create Resource Metric"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Resource Metrics", to: "/providers/resource-metrics" }, { label: "Create Resource Metric" }]}>
      <CreateResourceMetric onSubmit={handleCreate} providers={providers?.list?.data || []} />
    </PageContainer>
  );
};

export default CreateResourceMetricPage;
