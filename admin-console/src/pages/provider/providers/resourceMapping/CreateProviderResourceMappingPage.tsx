import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateProviderResourceMapping from "components/templates/providers/resourceMapping/CreateProviderResourceMapping";

const CreateProviderResourceMappingPage = () => {
  const navigate = useNavigate();
  const { providerId } = useParams();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const resourceTypes = providersRedux.getters.resourceTypes(rootState);
  const images = providersRedux.getters.images(rootState);
  const flavors = providersRedux.getters.flavors(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createProviderResourceMapping(providerId, payload));
        navigate(`/providers/${providerId}/resource-mapping`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerId],
  );

  useEffect(() => {
    dispatch(providersRedux.actions.resourceTypes());
    dispatch(providersRedux.actions.images({ filters: JSON.stringify({ is_active: [true] }) }));
    dispatch(providersRedux.actions.flavors({ filters: JSON.stringify({ is_active: [true] }) }));
  }, [dispatch]);

  return (
    <PageContainer
      title="Add Resource Mapping"
      breadcrumbs={[
        { label: "Providers", to: "/providers" },
        { label: "Provider Resource Mapping", to: `/providers/${providerId}/resource-mapping` },
        { label: "Add Resource Mapping" },
      ]}>
      <CreateProviderResourceMapping resourceTypes={resourceTypes} images={images?.list?.data || []} flavors={flavors?.list?.data || []} onSubmit={handleCreate} />
    </PageContainer>
  );
};

export default CreateProviderResourceMappingPage;
