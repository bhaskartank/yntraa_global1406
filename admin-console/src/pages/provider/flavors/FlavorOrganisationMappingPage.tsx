import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import FlavorDetailBar from "components/molecules/DetailBars/FlavorDetailBar";
import FlavorOrganisationMapping from "components/templates/providers/OrganisationMapping";

const FlavorOrganisationMappingPage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { flavor }: { flavor: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisations = organisationsRedux.getters.organisations(rootState);

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.flavorOrganisationMapping(flavor?.provider_id, flavor?.id, payload?.organisation_id));
        navigate(`/providers/flavors`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, flavor],
  );

  const handleCancel = useCallback(() => {
    navigate(`/providers/flavors`);
  }, [navigate]);

  useEffect(() => {
    dispatch(organisationsRedux.actions.organisations());
  }, [dispatch]);

  return (
    <PageContainer title="Map Organisation" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Flavors", to: `/providers/flavors` }, { label: "Map Organisation" }]}>
      <FlavorDetailBar flavor={flavor} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <FlavorOrganisationMapping onSubmit={handleUpdate} organisations={organisations?.list?.data || []} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default FlavorOrganisationMappingPage;
