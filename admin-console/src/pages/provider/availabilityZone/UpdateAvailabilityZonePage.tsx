import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import AvailabilityZoneDetailBar from "components/molecules/DetailBars/AvailabilityZoneDetailBar";
import UpdateAvailabilityZone from "components/templates/providers/availabilityZone/AvailabilityZoneForm";

const UpdateAvailabilityZonePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { zone }: { zone: any } = routerState;

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateZone(zone?.provider_id, { ...payload, availability_zone_id: zone?.id }));
        navigate("/providers/availability-zones");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, zone],
  );

  return (
    <PageContainer
      title="Update Availability Zone"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Availability Zones", to: "/providers/availability-zones" }, { label: "Update Availability Zone" }]}>
      <AvailabilityZoneDetailBar zone={zone} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <UpdateAvailabilityZone onSubmit={handleUpdate} defaultValues={zone} />
    </PageContainer>
  );
};

export default UpdateAvailabilityZonePage;
