import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import networksRedux from "store/modules/networks";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateSecurityGroupRule from "components/templates/networks/securityGroups/CreateSecurityGroupRule";

const CreateSecurityGroupRulePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state } = useLocation();

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.CreateSecurityGroupRule(state?.provider_id, state?.project_id, state?.id, payload));
        navigate("/networks/security-groups");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, state],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer title="Create Security Group Rule" breadcrumbs={[{ label: "Security Group", to: `/networks/security-groups` }, { label: "Create Security Group Rule" }]}>
      <CreateSecurityGroupRule handleCreate={handleCreate} providers={providers?.list?.data || []} />
    </PageContainer>
  );
};

export default CreateSecurityGroupRulePage;
