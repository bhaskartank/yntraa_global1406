import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import CreateSecurityGroupByType from "components/templates/organisations/projects/CreateSecurityGroupByType";

const CreateSecurityGroupByTypePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { providerMapping } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const securityGroupTypes = projectsRedux.getters.securityGroupTypes(rootState);
  const projectById = projectsRedux.getters.projectById(rootState, projectId);

  const onSubmit = useCallback(
    async (payload) => {
      try {
        await dispatch(projectsRedux.actions.createSecurityGroupByType(providerMapping?.provider_id, projectId, payload));
        navigate(`/organisations/projects/${projectId}/providers`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerMapping, projectId],
  );

  useEffect(() => {
    dispatch(projectsRedux.actions.securityGroupTypes());
  }, [dispatch]);

  return (
    <PageContainer
      title="Create SG by Type"
      breadcrumbs={[
        { label: "Projects", to: "/organisations/projects" },
        { label: "Provider Mapping", to: `/organisations/projects/${projectById.organisation_id}/${projectId}/providers` },
        { label: "Create SG by Type" },
      ]}>
      <ProjectDetailBar project={projectById} />
      <CreateSecurityGroupByType onSubmit={onSubmit} types={securityGroupTypes} />
    </PageContainer>
  );
};

export default CreateSecurityGroupByTypePage;
