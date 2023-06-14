import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateFlavor from "components/templates/providers/flavors/FlavorForm";

const CreateFlavorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createFlavor(payload?.provider_id, payload));
        navigate("/providers/flavors");
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
    <PageContainer title="Create Flavor" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Flavors", to: "/providers/flavors" }, { label: "Create Flavor" }]}>
      <CreateFlavor onSubmit={handleCreate} providers={providers?.list?.data || []} />
    </PageContainer>
  );
};

export default CreateFlavorPage;
