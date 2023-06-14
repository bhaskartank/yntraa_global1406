import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImageDetailBar from "components/molecules/DetailBars/ImageDetailBar";
import ImageResourceMapping from "components/templates/providers/images/ImageResourceMapping";
import ListImageResourceMapping from "components/templates/providers/images/ListImageResourceMapping";

const ListImageResourceMappingPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { image }: { image: any } = routerState;

  const fetchImageResourceMapping = useCallback(() => {
    dispatch(providersRedux.actions.imageResourceMapping(image?.provider_id, image?.id));
  }, [dispatch, image]);

  const exportImageResourceMapping = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportImageResourceMapping(image?.provider_id, image?.id));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, image]);

  const handleDeleteImageResourceMapping = useCallback(
    async (resourceImageMappingId) => {
      try {
        await dispatch(providersRedux.actions.deleteProviderResourceMapping(image?.provider_id, resourceImageMappingId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, image, datalistKey],
  );

  const handleCreateImageResourceMapping = useCallback(
    async (resourceType) => {
      try {
        await dispatch(providersRedux.actions.createImageResourceMapping(image?.provider_id, image?.id, { resource_type: resourceType }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, image, datalistKey],
  );

  return (
    <PageContainer title="Resource Mapping" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images", to: "/providers/images" }, { label: "Resource Mapping" }]}>
      <ImageDetailBar image={image} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ImageResourceMapping onSubmit={handleCreateImageResourceMapping} />
      <ListImageResourceMapping
        fetchImageResourceMapping={fetchImageResourceMapping}
        exportImageResourceMapping={exportImageResourceMapping}
        handleDeleteImageResourceMapping={handleDeleteImageResourceMapping}
      />
    </PageContainer>
  );
};

export default ListImageResourceMappingPage;
