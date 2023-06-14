import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";
import modalRedux from "store/modules/modal";
import securityGroupRedux from "store/modules/security-groups";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateSecurityGroup from "components/templates/network/CreateSecurityGroup";

import { appRoutes, pageTitles } from "utils/constants";

const CreateSecurityGroupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const userId = authRedux.getters.userId(rootState);

  const createSecurityGroup = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Security Group",
            description: "Are you sure you want to create this security group?",
            onConfirm: async () => {
              try {
                await dispatch(securityGroupRedux.actions.createSecurityGroup({ ...payload, user_id: userId }));
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
    [dispatch, navigate, userId],
  );

  const handleCancel = useCallback(() => {
    dispatch(
      modalRedux.actions.open({
        title: "Create Security Group",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.NETWORK),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_SECURITY_GROUP}>
      <CreateSecurityGroup onSubmit={createSecurityGroup} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateSecurityGroupPage;
