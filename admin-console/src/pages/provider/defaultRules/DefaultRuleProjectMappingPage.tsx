import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import DefaultRuleDetailBar from "components/molecules/DetailBars/DefaultRuleDetailBar";
import DefaultRuleProjectMapping from "components/templates/providers/defaultRules/projectMapping/DefaultRuleProjectMapping";

const DefaultRuleProjectMappingPage = () => {
  const { state: routerState } = useLocation();
  const { defaultRule }: { defaultRule: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const defaultRuleProjects = providersRedux.getters.defaultRuleProjects(rootState);

  const handleFetchProjectMapping = useCallback(() => {
    dispatch(providersRedux.actions.defaultRuleProjects(defaultRule?.provider_id, defaultRule?.id));
  }, [dispatch, defaultRule]);

  const applyRuleOnProjects = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.applyRuleOnProjects(defaultRule?.provider_id, defaultRule?.id, { project_id: payload }));
        handleFetchProjectMapping();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, defaultRule, handleFetchProjectMapping],
  );

  const removeRuleFromProjects = useCallback(
    async (payload) => {
      try {
        await dispatch(providersRedux.actions.removeRuleFromProjects(defaultRule?.provider_id, defaultRule?.id, { project_id: payload }));
        handleFetchProjectMapping();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, defaultRule, handleFetchProjectMapping],
  );

  useEffect(() => {
    handleFetchProjectMapping();
  }, [handleFetchProjectMapping]);

  return (
    <PageContainer
      title="Map Project"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Default Rules", to: `/providers/default-rules` }, { label: "Map Project" }]}>
      <DefaultRuleDetailBar defaultRule={defaultRule} />
      <DefaultRuleProjectMapping projects={defaultRuleProjects} applyRuleOnProjects={applyRuleOnProjects} removeRuleFromProjects={removeRuleFromProjects} />
    </PageContainer>
  );
};

export default DefaultRuleProjectMappingPage;
