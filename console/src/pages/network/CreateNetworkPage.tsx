import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import modalRedux from "store/modules/modal";
import networkRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateNetwork from "components/templates/network/CreateNetwork";

import { appRoutes, pageTitles } from "utils/constants";

const CreateNetworkPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createNetwork = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Network",
            description: "Are you sure you want to create this network?",
            onConfirm: async () => {
              try {
                await dispatch(networkRedux.actions.createNetwork(payload));
                navigate(appRoutes.NETWORK);
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
        title: "Create Network",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.NETWORK),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_NETWORK}>
      <CreateNetwork onSubmit={createNetwork} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateNetworkPage;
