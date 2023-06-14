import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateServiceProvider from "components/templates/providers/serviceProviders/CreateServiceProvider";

const CreateServiceProviderPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const serviceTypes = providersRedux.getters.serviceTypes(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createServiceProvider(providerId, payload));
        navigate(`/providers/${providerId}/service-providers`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerId],
  );

  useEffect(() => {
    dispatch(providersRedux.actions.serviceTypes());
  }, [dispatch]);

  return (
    <PageContainer
      title="Create Service Provider"
      breadcrumbs={[
        { label: "Providers", to: "/providers" },
        { label: "Service Providers", to: `/providers/${providerId}/service-providers` },
        { label: "Create Service Provider" },
      ]}>
      <CreateServiceProvider serviceTypes={serviceTypes} onSubmit={handleCreate} />
    </PageContainer>
  );
};

export default CreateServiceProviderPage;
