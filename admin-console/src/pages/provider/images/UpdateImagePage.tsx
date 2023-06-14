import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImageDetailBar from "components/molecules/DetailBars/ImageDetailBar";
import UpdateImage from "components/templates/providers/images/UpdateImage";

const UpdateImagePage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { image }: { image: any } = routerState;

  const dispatch = useDispatch();

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateImage(image?.provider_id, image?.id, payload));
        navigate(`/providers/images`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, image],
  );

  return (
    <PageContainer title="Update Image" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images", to: `/providers/images` }, { label: "Update Image" }]}>
      <ImageDetailBar image={image} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <UpdateImage onSubmit={handleUpdate} defaultValues={image} />
    </PageContainer>
  );
};

export default UpdateImagePage;
