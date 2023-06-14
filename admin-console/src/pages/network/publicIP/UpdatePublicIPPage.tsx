import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import networksRedux from "store/modules/networks";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import UpdatePublicIPBar from "components/molecules/DetailBars/UpdatePublicIPBar";
import UpdatePublicIP from "components/templates/networks/UpdatePublicIPForm";

const UpdatePublicIPPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();
  const { publicIPs }: { publicIPs: any } = routerState;

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.updatePublicIP(publicIPs?.provider_id, publicIPs?.id, payload));
        navigate("/networks/public-ip-pools");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, publicIPs],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Update Public IP"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Public IP Pool", to: "/networks/public-ip-pools" }, { label: "Update Public IP" }]}>
      <UpdatePublicIPBar publicIP={publicIPs} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <UpdatePublicIP onSubmit={handleUpdate} providers={providers?.list?.data || []} defaultValues={publicIPs} />
    </PageContainer>
  );
};

export default UpdatePublicIPPage;
