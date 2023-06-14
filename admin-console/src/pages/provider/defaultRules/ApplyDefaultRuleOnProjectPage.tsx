import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import organisationsRedux from "store/modules/organisations";
import projectsRedux from "store/modules/projects";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApplyDefaultRuleOnProject from "components/templates/providers/defaultRules/ApplyDefaultRuleOnProject";

const ApplyDefaultRuleOnProjectPage = () => {
  const navigate = useNavigate();
  const { state: routerState } = useLocation();
  const { defaultRule } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const organisations = organisationsRedux.getters.organisations(rootState);
  const projects = projectsRedux.getters.projects(rootState);

  const handleApply = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.applyRuleOnProjects(defaultRule?.provider_id, defaultRule?.id, { project_id: [payload?.project_id] }));
        navigate("/providers/default-rules");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate, defaultRule],
  );

  const fetchProjects = useCallback(
    (payload) => {
      dispatch(projectsRedux.actions.projects(payload));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(organisationsRedux.actions.organisations());
  }, [dispatch]);

  return (
    <PageContainer
      title="Apply Default Rule"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Default Rules", to: "/providers/default-rules" }, { label: "Apply Default Rule" }]}>
      <ApplyDefaultRuleOnProject onSubmit={handleApply} organisations={organisations?.list?.data || []} fetchProjects={fetchProjects} projects={projects?.list?.data || []} />
    </PageContainer>
  );
};

export default ApplyDefaultRuleOnProjectPage;
