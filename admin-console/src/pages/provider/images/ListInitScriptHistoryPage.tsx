import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImageDetailBar from "components/molecules/DetailBars/ImageDetailBar";
import ListInitScriptHistory from "components/templates/providers/images/ListInitScriptHistory";

const ListInitScriptHistoryPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { image } = routerState;

  const fetchInitScriptHistory = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.initScriptHistory(image?.provider_id, image?.id, payload));
    },
    [dispatch, image],
  );

  const exportInitScriptHistory = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportInitScriptHistory(image?.provider_id, image?.id, {}));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, image]);

  return (
    <PageContainer
      title="Init Script History"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images", to: "/providers/images" }, { label: "Init Script History" }]}>
      <ImageDetailBar image={image} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListInitScriptHistory fetchInitScriptHistory={fetchInitScriptHistory} exportInitScriptHistory={exportInitScriptHistory} />
    </PageContainer>
  );
};

export default ListInitScriptHistoryPage;
