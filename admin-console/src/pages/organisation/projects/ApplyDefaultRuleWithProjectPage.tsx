import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import projectsRedux from "store/modules/projects";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProjectDetailBar from "components/molecules/DetailBars/ProjectDetailBar";
import ApplyDefaultRuleWithProject from "components/templates/organisations/projects/ApplyDefaultRuleWithProject";

const ApplyDefaultRuleWithProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { providerMapping } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const projectById = projectsRedux.getters.projectById(rootState, projectId);

  const onSubmit = useCallback(
    async (payload) => {
      try {
        await dispatch(projectsRedux.actions.applyDefaultRule(providerMapping?.provider_id, projectId, payload?.resource_type));
        navigate(`/organisations/projects/${projectId}/providers`);
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, providerMapping, projectId],
  );

  return (
    <PageContainer
      title="Apply Default Rule"
      breadcrumbs={[
        { label: "Projects", to: "/organisations/projects" },
        { label: "Provider Mapping", to: `/organisations/projects/${projectById.organisation_id}/${projectId}/providers` },
        { label: "Apply Default Rule" },
      ]}>
      <ProjectDetailBar project={projectById} />
      <ApplyDefaultRuleWithProject onSubmit={onSubmit} />
    </PageContainer>
  );
};

export default ApplyDefaultRuleWithProjectPage;
