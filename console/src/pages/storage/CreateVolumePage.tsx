import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import modalRedux from "store/modules/modal";
import volumeRedux from "store/modules/volumes";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateVolume from "components/templates/storage/CreateVolume";

import { appRoutes, pageTitles } from "utils/constants";

const CreateVolumePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateVolume = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Volume",
            description: "Are you sure you want to create this volume?",
            onConfirm: async () => {
              try {
                await dispatch(volumeRedux.actions.createVolume(payload));
                navigate(appRoutes.STORAGE);
              } catch (err) {
                console.error(err);
              }
            },
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const handleCancel = useCallback(() => {
    dispatch(
      modalRedux.actions.open({
        title: "Create Volume",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.STORAGE),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_VOLUME}>
      <CreateVolume onSubmit={handleCreateVolume} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateVolumePage;
