import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ImageDetailBar from "components/molecules/DetailBars/ImageDetailBar";
import ManageInitScript from "components/templates/providers/images/ManageInitScript";

const ManageInitScriptPage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { image } = routerState;

  const dispatch = useDispatch();

  const fetchInitScript = useCallback(
    (scriptType) => {
      dispatch(providersRedux.actions.initScript(image?.provider_id, image?.id, { script_type: scriptType }));
    },
    [dispatch, image],
  );

  const addInitScript = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.addInitScript(image?.provider_id, image?.id, { init_script: payload?.initScript, script_type: "system" }));
        navigate(`/providers/images`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, image],
  );

  const updateInitScript = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.updateInitScript(image?.provider_id, image?.id, { init_script: payload?.initScript, script_type: payload?.scriptType }));
        navigate(`/providers/images`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, image],
  );

  const deleteInitScript = useCallback(
    async (scriptType) => {
      try {
        await dispatch(providersRedux.actions.deleteInitScript(image?.provider_id, image?.id, scriptType));
        navigate("/providers/images");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, image],
  );

  useEffect(() => {
    dispatch(providersRedux.actions.initScriptVariables());

    return () => {
      dispatch(providersRedux.slice.actions.resetInitScript());
    };
  }, [dispatch]);

  return (
    <PageContainer title="Init Script" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Images", to: "/providers/images" }, { label: "Init Script" }]}>
      <ImageDetailBar image={image} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ManageInitScript image={image} fetchInitScript={fetchInitScript} addInitScript={addInitScript} updateInitScript={updateInitScript} deleteInitScript={deleteInitScript} />
    </PageContainer>
  );
};

export default ManageInitScriptPage;
