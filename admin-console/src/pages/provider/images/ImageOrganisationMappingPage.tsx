import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImageDetailBar from "components/molecules/DetailBars/ImageDetailBar";
import ImageOrganisationMapping from "components/templates/providers/OrganisationMapping";

const ImageOrganisationMappingPage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { image }: { image: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisations = organisationsRedux.getters.organisations(rootState);

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.imageOrganisationMapping(image?.provider_id, image?.id, payload?.organisation_id));
        navigate(`/providers/images`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, image],
  );

  const handleCancel = useCallback(() => {
    navigate(`/providers/images`);
  }, [navigate]);

  useEffect(() => {
    dispatch(organisationsRedux.actions.organisations());
  }, [dispatch]);

  return (
    <PageContainer title="Map Organisation" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images", to: `/providers/images` }, { label: "Map Organisation" }]}>
      <ImageDetailBar image={image} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ImageOrganisationMapping onSubmit={handleUpdate} organisations={organisations?.list?.data || []} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default ImageOrganisationMappingPage;
