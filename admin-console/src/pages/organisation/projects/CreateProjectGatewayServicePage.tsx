import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import CreateProjectGatewayService from "components/templates/organisations/projects/CreateProjectGatewayService";

const CreateProjectGatewayServicePage = () => {
  const { projectId, providerId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleCreate = useCallback(
    async (payload) => {
      try {
        await dispatch(projectsRedux.actions.createProjectGatewayService(providerId, projectId, payload));
        navigate(`/organisations/projects/${projectId}/providers/${providerId}/gateway-services`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerId, projectId],
  );

  return (
    <PageContainer
      title="Create Project Gateway Service"
      breadcrumbs={[
        { label: "Projects", to: "/organisations/projects" },
        { label: "Provider Mapping", to: `/organisations/projects/${projectId}/providers` },
        { label: "Gateway Services", to: `/organisations/projects/${projectId}/providers/${providerId}/gateway-services` },
        { label: "Create Project Gateway Service" },
      ]}>
      <CreateProjectGatewayService onSubmit={handleCreate} />
    </PageContainer>
  );
};

export default CreateProjectGatewayServicePage;
