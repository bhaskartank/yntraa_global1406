import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import ListProjectProviderMapping from "components/templates/organisations/projects/ListProjectProviderMapping";

const ListProjectProviderMappingPage = () => {
  const { projectId } = useParams();
  const { orgId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const projectById = projectsRedux.getters.projectById(rootState, projectId);

  const fetchProjectProviderMapping = useCallback(() => {
    dispatch(projectsRedux.actions.projectProviderMapping(projectId));
  }, [dispatch, projectId]);

  const createGateway = useCallback(
    (providerId) => {
      dispatch(projectsRedux.actions.createGateway(providerId, projectId));
    },
    [dispatch, projectId],
  );

  const deleteGateway = useCallback(
    (providerId) => {
      dispatch(projectsRedux.actions.deleteGateway(providerId, projectId));
    },
    [dispatch, projectId],
  );

  const deleteProject = useCallback(
    (providerId) => {
      dispatch(projectsRedux.actions.deleteProject(providerId, projectId));
    },
    [dispatch, projectId],
  );

  const reInitProject = useCallback(
    (providerId) => {
      dispatch(projectsRedux.actions.reInitProject(providerId, projectId, orgId));
    },
    [dispatch, orgId, projectId],
  );

  return (
    <PageContainer title="Provider Mapping" breadcrumbs={[{ label: "Projects", to: "/organisations/projects" }, { label: "Provider Mapping" }]}>
      <ProjectDetailBar project={projectById} />
      <ListProjectProviderMapping
        fetchProjectProviderMapping={fetchProjectProviderMapping}
        createGateway={createGateway}
        deleteGateway={deleteGateway}
        deleteProject={deleteProject}
        reInitProject={reInitProject}
      />
    </PageContainer>
  );
};

export default ListProjectProviderMappingPage;
