import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAvailabilityZones from "components/templates/providers/availabilityZone/ListAvailabilityZones";
import SyncAvailabilityZones from "components/templates/providers/availabilityZone/SyncAvailabilityZones";

const ListAvailabilityZonePage = () => {
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchZones = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.zones(payload));
    },
    [dispatch],
  );

  const exportZones = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportZones());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const handleSyncAvailabilityZones = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.syncZones(payload?.providerId, { resource_name: payload?.resourceName }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer title="Availability Zones" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Availability Zones" }]}>
      <SyncAvailabilityZones handleSync={handleSyncAvailabilityZones} providers={providers?.list?.data || []} />
      <ListAvailabilityZones fetchAvailabilityZones={fetchZones} exportAvailabilityZones={exportZones} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListAvailabilityZonePage;
