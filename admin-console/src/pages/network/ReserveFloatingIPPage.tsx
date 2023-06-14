import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import networksRedux from "store/modules/networks";
import projectsRedux from "store/modules/projects";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ReserveFloatingIP from "components/templates/networks/ReserveFloatingIPForm";

const ReserveFloatingIPPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providers = providersRedux.getters.providers(rootState);
  const projects = projectsRedux.getters.projects(rootState);
  const networks = networksRedux.getters.networks(rootState);

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.reserveFloatingIP(payload.network_id, payload.provider_id, payload.project_id, payload));
        navigate("/networks/floating-ip");
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

  const fetchProviderProjects = useCallback(
    async (payload) => {
      try {
        dispatch(projectsRedux.actions.projects({ filters: JSON.stringify({ provider_id: [payload] }) }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const fetchProviderProjectNetworks = useCallback(
    async (payload) => {
      try {
        dispatch(
          networksRedux.actions.networks({
            filters: JSON.stringify({ provider_id: [payload?.provider_id], project_id: [payload?.project_id], external: ["true"], status: ["Active"] }),
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Reserve Floating IP"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Floating IP", to: "/networks/floating-ip" }, { label: "Reserve Floating IP" }]}>
      <ReserveFloatingIP
        onSubmit={handleCreate}
        providers={providers?.list?.data || []}
        fetchProviderProjects={fetchProviderProjects}
        projects={projects?.list?.data}
        fetchProviderProjectNetworks={fetchProviderProjectNetworks}
        networks={networks?.list?.data}
      />
    </PageContainer>
  );
};

export default ReserveFloatingIPPage;
