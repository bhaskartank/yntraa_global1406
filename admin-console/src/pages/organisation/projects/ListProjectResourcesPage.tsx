import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import SelectResourceTypePanel from "components/templates/organisations/organisations/SelectResourceTypePanel";
import ListResources from "components/templates/organisations/projects/ListResources";

const ListResourcePage = () => {
  const { projectId } = useParams();

  const { state: routerState } = useLocation();
  const { provider } = routerState;
  const rootState = useSelector((state) => state);
  const projectById = projectsRedux.getters.projectById(rootState, projectId);

  const dispatch = useDispatch();

  const [selectedResource, setSelectedResource] = useState<any>("false");

  const fetchResources = useCallback(() => {
    dispatch(projectsRedux.actions.projectResources(provider?.provider_id, provider?.project_id, { with_internal: selectedResource === "true" }));
  }, [dispatch, provider, selectedResource]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <PageContainer
      title="Resources"
      breadcrumbs={[
        { label: "Projects", to: "/organisations/projects" },
        { label: "Provider Mapping", to: `/organisations/projects/${projectById.organisation_id}/${projectId}/providers` },
        { label: "Resources" },
      ]}>
      <ProjectDetailBar project={projectById} />
      <SelectResourceTypePanel selectedResource={selectedResource} handleSelectResource={setSelectedResource} />
      <ListResources />
    </PageContainer>
  );
};

export default ListResourcePage;
