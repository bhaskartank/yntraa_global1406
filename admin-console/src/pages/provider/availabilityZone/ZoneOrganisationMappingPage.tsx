import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import AvailabilityZoneDetailBar from "components/molecules/DetailBars/AvailabilityZoneDetailBar";
import ZoneOrganisationMapping from "components/templates/providers/OrganisationMapping";

const ZoneOrganisationMappingPage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { zone }: { zone: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisations = organisationsRedux.getters.organisations(rootState);

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.zoneOrganisationMapping(zone?.provider_id, zone?.id, payload?.organisation_id));
        navigate(`/providers/availability-zones`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, zone],
  );

  const handleCancel = useCallback(() => {
    navigate(`/providers/availability-zones`);
  }, [navigate]);

  useEffect(() => {
    dispatch(organisationsRedux.actions.organisations());
  }, [dispatch]);

  return (
    <PageContainer
      title="Map Organisation"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Availability Zones", to: `/providers/availability-zones` }, { label: "Map Organisation" }]}>
      <AvailabilityZoneDetailBar zone={zone} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ZoneOrganisationMapping onSubmit={handleUpdate} organisations={organisations?.list?.data || []} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default ZoneOrganisationMappingPage;
