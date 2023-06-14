import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import UpdateServiceProviderBar from "components/molecules/DetailBars/UpdateServiceProviderBar";
import UpdateServiceProvider from "components/templates/providers/serviceProviders/CreateServiceProvider";

const UpdateServiceProviderPage = () => {
  const navigate = useNavigate();
  const { providerId, serviceProviderId } = useParams();
  const { state: routerState } = useLocation();
  const { serviceProvider }: { serviceProvider: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const serviceTypes = providersRedux.getters.serviceTypes(rootState);

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateServiceProvider(providerId, serviceProviderId, payload));
        navigate(`/providers/${providerId}/service-providers`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerId, serviceProviderId],
  );

  useEffect(() => {
    dispatch(providersRedux.actions.serviceTypes());
  }, [dispatch]);

  return (
    <PageContainer
      title="Update Service Provider"
      breadcrumbs={[
        { label: "Providers", to: "/providers" },
        { label: "Service Providers", to: `/providers/${providerId}/service-providers` },
        { label: "Update Service Provider" },
      ]}>
      <UpdateServiceProviderBar serviceProvider={serviceProvider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <UpdateServiceProvider serviceTypes={serviceTypes} onSubmit={handleUpdate} defaultValues={serviceProvider} />
    </PageContainer>
  );
};

export default UpdateServiceProviderPage;
