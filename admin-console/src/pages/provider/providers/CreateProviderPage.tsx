import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateProvider from "components/templates/providers/provider/CreateProvider";

const CreateProviderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providerTypes = providersRedux.getters.providerTypes(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.createProvider(payload));
        navigate("/providers");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const testConnection = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.testConnection(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(providersRedux.actions.providerTypes());
  }, [dispatch]);

  return (
    <PageContainer title="Create Provider" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Create Provider" }]}>
      <CreateProvider handleCreate={handleCreate} providerTypes={providerTypes} testConnection={testConnection} />
    </PageContainer>
  );
};

export default CreateProviderPage;
