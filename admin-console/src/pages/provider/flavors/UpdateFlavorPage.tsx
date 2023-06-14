import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import FlavorDetailBar from "components/molecules/DetailBars/FlavorDetailBar";
import UpdateFlavor from "components/templates/providers/flavors/FlavorForm";

const UpdateFlavorPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const { state: routerState } = useLocation();
  const { flavor }: { flavor: any } = routerState;

  const handleUpdate = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateFlavor(flavor?.provider_id, flavor?.id, payload));
        navigate("/providers/flavors");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, flavor],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer title="Update Flavor" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Flavors", to: "/providers/flavors" }, { label: "Update Flavor" }]}>
      <FlavorDetailBar flavor={flavor} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <UpdateFlavor onSubmit={handleUpdate} providers={providers?.list?.data || []} defaultValues={flavor} />
    </PageContainer>
  );
};

export default UpdateFlavorPage;
