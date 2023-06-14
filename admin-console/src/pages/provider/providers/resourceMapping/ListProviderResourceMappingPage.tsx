import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListProviderResourceMapping from "components/templates/providers/resourceMapping/ListProviderResourceMapping";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListProviderResourceMappingPage = () => {
  const datalistKey = useCurrentPath();
  const { providerId } = useParams();

  const rootState = useSelector((state) => state);
  const providerById = providersRedux.getters.providerById(rootState, providerId);

  const dispatch = useDispatch();

  const fetchProviderResourceMapping = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.providerResourceMapping(providerId, payload));
    },
    [dispatch, providerId],
  );

  const exportProviderResourceMapping = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportProviderResourceMapping(providerId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, providerId]);

  const handleDeleteProviderResourceMapping = useCallback(
    async (resourceImageFlavorId) => {
      try {
        await dispatch(providersRedux.actions.deleteProviderResourceMapping(providerId, resourceImageFlavorId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, datalistKey],
  );

  return (
    <PageContainer title="Provider Resource Mapping" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Provider Resource Mapping" }]}>
      <ProviderSummaryPanel provider={providerById} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListProviderResourceMapping
        fetchProviderResourceMapping={fetchProviderResourceMapping}
        exportProviderResourceMapping={exportProviderResourceMapping}
        handleDeleteProviderResourceMapping={handleDeleteProviderResourceMapping}
      />
    </PageContainer>
  );
};

export default ListProviderResourceMappingPage;
