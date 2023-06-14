import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateDefaultRule from "components/templates/providers/defaultRules/CreateDefaultRule";

const CreateDefaultRulePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createDefaultRule(payload?.provider_id, payload));
        navigate("/providers/default-rules");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Create Default Rule"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Default Rules", to: "/providers/default-rules" }, { label: "Create Default Rule" }]}>
      <CreateDefaultRule handleCreate={handleCreate} providers={providers?.list?.data || []} />
    </PageContainer>
  );
};

export default CreateDefaultRulePage;
