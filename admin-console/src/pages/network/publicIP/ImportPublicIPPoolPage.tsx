import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import networksRedux from "store/modules/networks";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImportPublicIP from "components/templates/networks/PublicIPForm";

const ImportPublicIPPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.importPublicIPPool(payload?.provider_id, payload));
        navigate("/networks/public-ip-pools");
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
      title="Import Public IP Pool"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Public IP Pool", to: "/networks/public-ip-pools" }, { label: "Import Public IP Pool" }]}>
      <ImportPublicIP onSubmit={handleUpdate} providers={providers?.list?.data || []} />
    </PageContainer>
  );
};

export default ImportPublicIPPage;
