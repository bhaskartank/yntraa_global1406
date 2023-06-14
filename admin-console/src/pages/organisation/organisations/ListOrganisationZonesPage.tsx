import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import OrganisationDetailBar from "components/molecules/DetailBars/OrganisationDetailBar";
import ListZones from "components/templates/organisations/organisations/ListZones";
import MapZonePanel from "components/templates/organisations/organisations/MapZonePanel";

const ListZonePage = () => {
  const datalistKey = useCurrentPath();
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const zones = providersRedux.getters.zones(rootState);
  const organisationById = organisationsRedux.getters.organisationById(rootState, organisationId);

  const [selectedZone, setSelectedZone] = useState<any>(null);

  const fetchZones = useCallback(
    (payload) => {
      dispatch(organisationsRedux.actions.organisationZones(organisationId, payload));
    },
    [dispatch, organisationId],
  );

  const exportZones = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationZones(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  const handleMap = useCallback(async () => {
    try {
      await dispatch(organisationsRedux.actions.mapZoneToOrganisation(organisationId, 12, selectedZone));
      dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      setSelectedZone(null);
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId, datalistKey, selectedZone]);

  useEffect(() => {
    dispatch(providersRedux.actions.zones({}));
  }, [dispatch]);

  return (
    <PageContainer title="Zones" breadcrumbs={[{ label: "Organisations", to: "/organisations" }, { label: "Zones" }]}>
      <OrganisationDetailBar organisation={organisationById} />
      <MapZonePanel handleMap={handleMap} selectedZone={selectedZone} handleSelectZone={setSelectedZone} zones={zones?.list?.data || []} />
      <ListZones fetchZones={fetchZones} exportZones={exportZones} />
    </PageContainer>
  );
};

export default ListZonePage;
