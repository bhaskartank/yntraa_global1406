import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";
import modalRedux from "store/modules/modal";
import securityGroupRuleRedux from "store/modules/security-group-rules";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateSecurityRule from "components/templates/network/CreateSecurityRule";

import { appRoutes, pageTitles } from "utils/constants";

const CreateSecurityRulePage = () => {
  const { securityGroupId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const userId = authRedux.getters.userId(rootState);

  const createSecurityRule = useCallback(
    async (payload) => {
      try {
        await dispatch(
          modalRedux.actions.open({
            title: "Create Security Rule",
            description: "Are you sure you want to create this security rule?",
            onConfirm: async () => {
              try {
                await dispatch(securityGroupRuleRedux.actions.createSecurityGroupRule(securityGroupId, { ...payload, user_id: userId }));
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
    [dispatch, navigate, securityGroupId, userId],
  );

  const handleCancel = useCallback(() => {
    dispatch(
      modalRedux.actions.open({
        title: "Create Security Rule",
        description: "Are you sure you want to discard your changes?",
        onConfirm: () => navigate(appRoutes.NETWORK),
      }),
    );
  }, [dispatch, navigate]);

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_CREATE_SECURITY_RULE}>
      <CreateSecurityRule onSubmit={createSecurityRule} onCancel={handleCancel} />
    </PageContainer>
  );
};

export default CreateSecurityRulePage;
